import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const MessageModel =
  (mongoose.models?.Messages as mongoose.Model<Message>) ||
  mongoose.model<Message>("Messages", messageSchema);

  export interface User extends Document {
    _id: ObjectId; 
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpiration: Date;
    isVerified: boolean;
    messages: Message[];
    isAcceptingMessage: boolean;
  }

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required!"],
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minlength: 6,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
      "enter strong password",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    trim: true,
    minlength: 3,
    match: [
      /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
      "please use a valid email address",
    ],
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCODE is required!"],
  },
  verifyCodeExpiration: {
    type: Date,
    required: [true, "VERIFY CODE expiration is required!"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  messages: [messageSchema],
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
});

export const UserModel =
  (mongoose.models?.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
