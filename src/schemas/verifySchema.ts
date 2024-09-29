import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z
    .string()
    .length(6, "code must be 6 digits")
    .regex(/^\d+$/, "code must be digits"),
});
