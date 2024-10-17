import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import {  UserModel } from "@/model/user.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;

  if (!user && !session) {
    return Response.json(
      { message: "unauthorized user access, please login", success: false },
      { status: 401 }
    );
  }

  const { acceptMessages } = await request.json();

  try {
    const newUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!newUser) {
      return Response.json(
        { message: "failed to change is accepting messages", success: false },
        { status: 500 }
      );
    }
    return Response.json(
      {
        message: "message acceptence status updated successfully",
        success: true,
        data: newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "failed to change is accepting messages", success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await auth();
  const user: User = session?.user;
  if (!user && !session) {
    return Response.json(
      { message: "unauthorized user access, please login", success: false },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return Response.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "success",
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "failed to get is accepting messages", success: false },
      { status: 500 }
    );
  }
}




