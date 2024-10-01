"use client"; // This form is a client component

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { credentialLogin } from "@/app/action/login";

const Loginform = () => {
  const loginHandler = async (formData: FormData): Promise<void> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      console.error("Please provide both email and password");
      return;
    }

    const err = await credentialLogin(email, password);

    if (!err) {
      console.log("Login successful");
      window.location.href = "/"; // Redirect on success
    } else {
      console.error("Login error:", err);
    }
  };

  return (
    <form action={loginHandler}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
      </div>
      <br />
      <Button variant={"default"} type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default Loginform;
