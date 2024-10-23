// import type { NextApiRequest, NextApiResponse } from "next";

import { Resend } from "resend";
import EmailTemplate from "../../emails/EmailTemplatet";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SentVerification {
  email: string;
  username?: string;
  verificationCode: string;
}

export const sentVerificationEmail = async ({
  email,
  username,
  verificationCode,
}: SentVerification): Promise<ApiResponse> => {
  console.log("at sent verification email:",email, username, verificationCode);
  console.log(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Bunky chat | verification code",
      react: EmailTemplate({ username, verificationCode }),
    });
    console.log("email sent to your",data);
    console.log("error sending verification email", error);
    return {
      status: 200,
      message: "otp hase sent successfully",
      success: true,
    };
  } catch (error) {
    console.error("error sending verification email", error);
    return { status: 500, message: "otp sent failed", success: false };
  }
};
