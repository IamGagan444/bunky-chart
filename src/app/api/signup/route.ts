import { sentVerificationEmail } from "@/helper/sentVerficationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, password } = await request.json();
  console.log(username, email, password);
  if (!username && !email && !password) {
    return Response.json(
      { success: false, message: "all fields are required" },
      { status: 400 }
    );
  }

  try {
    const isUsernameVerifiedUserExist = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isUsernameVerifiedUserExist) {
      return { status: 400, message: "User already exist", success: false };
    }

    const isEmailRegisterd = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 15 * 60 * 1000);

    if (isEmailRegisterd) {
      // email regisreed but username not verified yet

      if (isEmailRegisterd?.isVerified) {
        return {
          status: 400,
          message: "Email already registered",
          success: false,
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        isEmailRegisterd.password = hashedPassword;
        isEmailRegisterd.verifyCode = verifyCode;
        isEmailRegisterd.verifyCodeExpiration = expiryDate;

        await isEmailRegisterd.save();
      }
    } else {
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
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "user registered succssfully, please verify your email",
          data: newUser,
        },
        { status: 201 }
      );
    }







    
  } catch (error) {
    console.error("error while registering", error);
    return Response.json({
      status: 500,
      message: "error while registering",
      success: false,
    });
  }
}
