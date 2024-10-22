import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;

  await dbConnect();
  const session = await auth();
  const user: User = session?.user as User;

  if (!user && !session) {
    return Response.json(
      { message: "unauthorized", succes: false },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const newUser = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (newUser.modifiedCount == 0) {
      return Response.json(
        { message: "message not found", success: false },
        { status: 404 }
      );
    }
    return Response.json(
      { message: "message deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("something went wrong on message route", error);
    return Response.json(
      { message: "something went wrong", succes: false },
      { status: 500 }
    );
  }
}
