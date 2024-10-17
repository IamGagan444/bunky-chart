import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";

import Loginform from "@/client/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Signin =  async() => {
  // https://instagram-nrdh.onrender.com/api/user-login

  const session=await auth()
  if(session?.user){
    return redirect("/")
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">Bunky chat</CardTitle>
          </CardHeader>
          <CardContent>
            <Loginform />
          </CardContent>
        </Card>
        <Card className="w-[350px] my-2 p-4">
          <p className="text-center">
            Don&#39;t have an account?{" "}
            <Link href="/accounts/signup" className="text-sky-500">
              Signup
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
