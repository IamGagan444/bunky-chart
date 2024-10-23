import { sentVerificationEmail } from "@/helper/sentVerficationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, password } = await request.json();
  console.log(username, email, password);

  // Check if all fields are provided
  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({ success: false, message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    const isUsernameVerifiedUserExist = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // Check if username is already taken by a verified user
    if (isUsernameVerifiedUserExist) {
      return new Response(
        JSON.stringify({ success: false, message: "Username already taken" }),
        { status: 400 }
      );
    }

    const isEmailRegistered = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 15 * 60 * 1000);

    if (isEmailRegistered) {
      // Email is registered but user is not verified yet
      if (isEmailRegistered.isVerified) {
        return new Response(
          JSON.stringify({ success: false, message: "Email already registered" }),
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        isEmailRegistered.password = hashedPassword;
        isEmailRegistered.verifyCode = verifyCode;
        isEmailRegistered.verifyCodeExpiration = expiryDate;

        await isEmailRegistered.save();

        return new Response(
          JSON.stringify({
            success: true,
            message: "User already registered but not verified. Please check your email to verify.",
          }),
          { status: 200 }
        );
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiration: expiryDate,
        isVerified: false,
        messages: [],
        isAcceptingMessage: true,
      });

      await newUser.save();

      const emailResponse = await sentVerificationEmail({
        email,
        verificationCode: verifyCode,
        username,
      });

      if (!emailResponse.success) {
        return new Response(
          JSON.stringify({
            success: false,
            message: emailResponse.message,
          }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "User registered successfully, please verify your email",
          data: newUser,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error while registering", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error while registering",
      }),
      { status: 500 }
    );
  }
}
