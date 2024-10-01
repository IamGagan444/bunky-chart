import { Mesasage } from "@/model/user.model";

export interface ApiResponse {
  status: number;
  message: string;
  success: boolean;
  isAcceptingMessages?: boolean;
  messages?: Array<Mesasage>;
}

export interface LoginUser{
  email:string,
  password:string
}