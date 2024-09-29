import mongoose, { Schema, Document } from "mongoose";

export interface Mesasage extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Mesasage> = new Schema({
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

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
  verifyCodeExpiration: Date;
  isVerified: boolean;
  messages: Mesasage[];
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
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
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
    // required: [true, "vE is required!"],
  },
  messages: [messageSchema],
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
});

export const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export const messageModel =
  (mongoose.models.Messages as mongoose.Model<Mesasage>) ||
  mongoose.model<Mesasage>("Messages", messageSchema);
