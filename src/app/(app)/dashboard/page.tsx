"use client";
import { auth } from "@/auth";
import MessageCard from "@/client/MessageCard";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setSwitchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== messageId));
  };
  const { data: session } = useSession();

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
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError?.response?.data?.message || "message setting issue",
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setSwitchLoading(false);

      try {
        const response = await axios.get<ApiResponse>(`/api/get-message`);
        setMessages(response?.data?.messages);
        if (refresh) {
          toast({
            title: "Refreshed messagws",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError?.response?.data?.message || "message setting issue",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setSwitchLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      fetchMessage();
      fetchAcceptMessages();
    }
  }, [setValue, session, fetchAcceptMessages, fetchMessage]);

  const handleSwitchChange = async (checked: boolean) => {
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
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError?.response?.data?.message || "message setting issue",
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  };
  const username = session?.user.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(`${baseUrl}/u/${username}`);
    toast({
      title: "copied",
      description: "Link copied to clipboard",
    });
  };

  if (!session?.user) {
    toast({
      title: "session expired",
      description: "You are not authorized to access this page",
      variant: "destructive",
    });
    return redirect("/accounts/sign-in");
  }

  return (
    <section className="m-2">
      <div>
        <h2 className="text-4xl font-bold text-center my-5">User Dashboard </h2>

        <div className="flex justify-center items-center space-x-2 ">
          <Input
            placeholder="Email"
            value={`${baseUrl}/u/${username}`}
            type="email"
            className="p-2"
          />

          <Button variant={"default"} onClick={handleCopy}>
            Copy
          </Button>
        </div>
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
          accept messages {acceptMessages ? "on" : "off"}{" "}
        </Label>
      </div>

      <div className="flex gap-4 flex-wrap items-center">
        {messages.length > 0 ? (
          messages?.map((item) => {
            return (
              <MessageCard
                key={item.id}
                message={item}
                onMessageDelete={handleDeleteMessage}
              />
            );
          })
        ) : (
          <h2 className="text-2xl font-bold text-center my-5">
            Tu to single he re ! tu kyu aya he idhar{" "}
          </h2>
        )}
      </div>
    </section>
  );
};

export default Page;
