import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(20),

  email: z
    .string()
    .email()
    .regex(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "invalid email"
    ),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
      "invalid password"
    ),
});
