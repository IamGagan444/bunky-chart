import dbConnect from "@/lib/dbConnect";
import { Message, UserModel } from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  if (!username && !content) {
    return Response.json(
      { message: "username and content is required!", success: false },
      { status: 400 }
    );
  }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          message: "user is not accepting messages from others!",
          success: false,
        },
        { status: 403 }
      );
    }
    const message = { content, createdAt: new Date() };

    user.messages.push(message as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "server is not responding", success: false },
      { status: 500 }
    );
  }
}
