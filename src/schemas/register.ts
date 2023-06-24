import z from "zod";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

export const registerSchema = z
  .object({
    email: z.string().email(),
  })
  .and(
    z
      .object({
        password: z.string().regex(passwordRegex),
        passwordConfirmation: z.string().min(1),
      })
      .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
      })
  );

export type RegisterSchema = z.infer<typeof registerSchema>;
