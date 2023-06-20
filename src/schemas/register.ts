import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(100),
  passwordConfirmation: z.string().min(10).max(100),
});
