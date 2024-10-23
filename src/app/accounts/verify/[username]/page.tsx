"use client";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const Page = () => {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log(data);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params?.username,
        verifyCode: data.verifyCode,
      });

      console.log(response);
      toast({
        title: "verification success",
        description: response.data.message,
        color: "green",
        className: "bg-green-400 text-white",
      });
      router.replace("/accounts/sign-in");
    } catch (error) {
      console.error("error in verify", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "signup failed",
        description: axiosError?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <Form {...form}>
        <Card className="w-[350px] flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center">
              <Mail className="mr-2" /> OTP Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enter the verification code sent to your Email{" "}
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      >
                        <InputOTPGroup className=" mx-auto">
                          <InputOTPSlot index={0} className="size-12" />
                          <InputOTPSlot index={1} className="size-12" />
                          <InputOTPSlot index={2} className="size-12" />
                          <InputOTPSlot index={3} className="size-12" />
                          <InputOTPSlot index={4} className="size-12" />
                          <InputOTPSlot index={5} className="size-12" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your phone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full my-2">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>
    </section>
  );
};

export default Page;
