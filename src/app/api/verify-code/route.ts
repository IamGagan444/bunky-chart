import { UserModel } from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { verifyCode,username } = await request.json();
    const decodedUsername = await decodeURIComponent(username);
    console.log("decodedUsername", decodedUsername);
    const user = await UserModel.findOne({
      username: decodedUsername,
      isVerified: false,
    });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeExpired = new Date(user.verifyCodeExpiration)<user.verifyCodeExpiration

    if(isCodeValid&&!isCodeExpired){
        user.isVerified=true;
        await user.save()
        return Response.json(
            {success:true,message:"User verified successfully"},
            {status:200}
        )
    }else if(isCodeExpired){
        return Response.json(
            {success:false,message:"Code expired"},
            {status:400}
        )
    }else{
        return Response.json(
            {success:false,message:"you have entered wrong verification code"},
            {status:400}
        )
    }




  } catch (err) {
    console.log(err);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
