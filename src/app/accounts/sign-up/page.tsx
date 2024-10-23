"use client";
import * as React from "react";
import { useDebounceCallback } from "usehooks-ts";
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
import { signupSchema } from "@/schemas/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function Signup() {
  const [username, setUserName] = React.useState<string>("");
  const [usernameMessage, setUserNameMessage] = React.useState("");
  const [isCheckingUserName, setIsCheckingUserName] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const debounced = useDebounceCallback(setUserName, 500);

  React.useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username.length > 0) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUserNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(axiosError.response?.data.message as string);
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast({
        title: "signup success",
        description: response.data.message,
        color: "green",
        className:"bg-green-400 text-white"
      });

      router.replace(`/accounts/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("error in signup page", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.messages;
      toast({
        title: "signup failed",
        description: err,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <Form {...form}>
        <Card className="w-[350px] my-28">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            {...field}
                            type="text"
                            onChange={(e) => {
                              debounced(e.target.value);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        { isCheckingUserName&&<Loader2 className="animate-spin mr-2" />} 
                        {usernameMessage && (
                          <p
                            className={`text-sm flex items-center ${
                              usernameMessage === "username is available"?"text-green-500":"text-red-500"
                            } `}
                          >
                           {usernameMessage}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                {/* {error?.success ? (
                  ""
                ) : (
                  <p className="w-full text-red-500 text-[12px]">
                    {error?.message}
                  </p>
                )} */}
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
                   <div className="flex items-center "> <Loader2 className="animate-spin size-4 mr-2" /> please wait..</div>
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
              Already have an account?{" "}
              <Link href={"/accounts/sign-in"} className=" text-sky-500">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Form>
    </section>
  );
}
