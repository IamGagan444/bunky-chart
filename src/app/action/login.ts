import { signIn } from "next-auth/react";

export const credentialLogin = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });
    console.log("result", result);
    if (result?.error) {
    
      return result.error
    }

   
    return result;
  } catch (error) {
    console.error("Unexpected error:", error);
    return Response.json(
      { message: "unexpected error in login.ts", success: false },
      { status: 500 }
    );
  }
};
