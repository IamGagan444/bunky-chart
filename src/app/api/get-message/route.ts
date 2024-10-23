import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET() {
  await dbConnect();
  const session = await auth();
  const user: User = session?.user as User;

  if (!user) {
    return Response.json(
      { message: "unauthorized", succes: false },
      { status: 401 }
    );
  }
 

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const newUser = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!newUser) {
      return Response.json(
        {
          message: "user not found",
          success: false,
        },
        { status: 404 }
      );
    }
    console.log("get messages user",newUser );
    return Response.json(
      {
        message: "data get successfully",
        messages: newUser[0]?.messages||"",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "something went wrong", succes: false },
      { status: 500 }
    );
  }
}
