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
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setSwitchLoading] = useState(false);

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

  const fetchMessage=useCallback(async(refresh:boolean)=>{

    


  },[])

  return <div>dashboard Page</div>;
};

export default Page;
