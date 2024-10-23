"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { signinSchema } from "@/schemas/signinSchema";

import { credentialLogin } from "@/app/action/login";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState("");

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const email = data?.email;
    const password = data?.password;

    const err = await credentialLogin(email, password);
console.log("credential issuue check",err.ok)
    if (err?.ok) {
      console.log("Login successful");
      router.replace("/dashboard");
      toast({
        title: "Login successful",
        description: "You have successfully logged in",
      });
      router.replace("/dashboard")
    } else {
      console.error("Login error:", err);
      toast({
        title: "Login Failed",
        description: "you have entered wrong credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <Form {...form}>
        <Card className="w-[350px] my-28">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">User Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <br />
              <div className="w-full flex items-center justify-between">
                <Button
                  variant="outline"
                  type="button"
                  // onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {" "}
                  {isSubmitting ? (
                    <div className="flex items-center ">
                      {" "}
                      <Loader2 className="animate-spin size-4 mr-2" /> please
                      wait..
                    </div>
                  ) : (
                    "Submit"
                  )}{" "}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
          {/* <br /> */}
          <CardFooter>
            <p className="text-center w-full">
              Don't have an account?{" "}
              <Link href={"/accounts/sign-up"} className=" text-sky-500">
                Signup
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Form>
    </section>
  );
};

export default Page;
