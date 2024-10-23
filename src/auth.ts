import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
// import { LoginUser } from "./types/ApiResponse";
import { User, UserModel } from "./model/user.model";
import dbConnect from "./lib/dbConnect";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "........",
        },
      },
      authorize: async (credentials):Promise<User|null> => {
        console.log(credentials);
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) {
          throw new Error("Invalid credentials");
        }
        await dbConnect();

        const user = await UserModel.findOne({email});
        console.log("login user ",user);

        if (!user) {
          throw new Error("User not found");
        }
        if (!user.isVerified) {
          throw new Error("User is not verified");
        }
        const isPasswordValid = await bcrypt.compare(
          password as string,
          user.password as string
        );
        console.log('isPasswordValid',isPasswordValid);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/accounts/sign-in",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token._id = user._id?.toString();

        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user._id = token._id as string | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
        session.user.isAcceptingMessage = token.isAcceptingMessage as
          | boolean
          | undefined;
          session.user.username = token.username as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
});
