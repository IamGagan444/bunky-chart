import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email?: string;  
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }

  interface Session {
    user: User & DefaultSession["user"]
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    email?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
