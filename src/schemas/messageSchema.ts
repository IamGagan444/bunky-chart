import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(4, "content must be atleast 4 charectors")
    .max(300, "300 charectors are allowed"),
});
