import { UserModel } from "@/model/user.model";
import z from "zod";
import { usernameValidationSchema } from "@/schemas/signupSchema";
import dbConnect from "@/lib/dbConnect";

const usernameQuerySchema = z.object({
  username: usernameValidationSchema,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParam);
    console.log("result:", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log("usernameErrors", usernameErrors);
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "invalidate query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const isUserExist = await UserModel.findOne({ username, isVerified: true });

    if (isUserExist) {
      return Response.json(
        { success: false, message: "username has already taken" },
        { status: 403 }
      );
    }
    return Response.json(
      { success: true, message: "username is available" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
