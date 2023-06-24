import z from "zod";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex),
    passwordConfirmation: z.string().min(10).max(100),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
