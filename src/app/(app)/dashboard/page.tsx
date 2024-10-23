"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MessageCard from "@/client/MessageCard";
import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/user.model";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setSwitchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { register, watch, setValue } = useForm<
    z.infer<typeof acceptMessageSchema>
  >({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessages", response?.data?.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError?.response?.data?.message || "Message setting issue",
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-message`);
      setMessages(response?.data?.messages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError?.response?.data?.message || "Message setting issue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [status, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: response?.data?.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError?.response?.data?.message || "Message setting issue",
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  };

  const handleCopy = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const username = session?.user.username;
    if (username) {
      navigator.clipboard.writeText(`${baseUrl}/u/${username}`);
      toast({
        title: "Copied",
        description: "Link copied to clipboard",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="h-dvh w-full fixed inset-0 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center z-50 ">
        <Loader2 className=" animate-spin size-10 " />
      </div>
    );
  }

  if (!session?.user) {
    toast({
      title: "Session expired",
      description: "You are not authorized to access this page",
      variant: "destructive",
    });
    return redirect("/accounts/sign-in");
  }

  return (
    <section className="m-2">
      <h2 className="text-4xl font-bold text-center my-5">User Dashboard</h2>
      <div className="flex justify-center items-center space-x-2">
        <Input
          placeholder="Email"
          value={`${window.location.protocol}//${window.location.host}/u/${session?.user?.username}`}
          type="email"
          className="p-2"
        />
        <Button variant="default" onClick={handleCopy}>
          Copy
        </Button>
      </div>
      <div className="flex items-center space-x-2 my-4">
        <Switch
          {...register("acceptMessages")}
          id="airplane-mode"
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <Label htmlFor="airplane-mode">
          Accept messages {acceptMessages ? "on" : "off"}
        </Label>
      </div>
      <div className="flex gap-4 flex-wrap items-center">
        {messages.length > 0 ? (
          messages.map((item) => (
            <MessageCard
              key={item.id}
              message={item}
              onMessageDelete={() =>
                setMessages((prev) => prev.filter((msg) => msg.id !== item.id))
              }
            />
          ))
        ) : (
          <h2 className="text-2xl font-bold text-center my-5">
            No messages yet!
          </h2>
        )}
      </div>
    </section>
  );
};

export default Page;
