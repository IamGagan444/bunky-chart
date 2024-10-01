import { signIn } from "next-auth/react";

export const credentialLogin = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,  // Prevent automatic redirection
    });

    if (result?.error) {
      console.log("Login error:", result.error);
      return result.error;
    }

    console.log("Login successful", result);
    return null; // No error
  } catch (error) {
    console.error("Unexpected error:", error);
    return "Unexpected error occurred";
  }
};
