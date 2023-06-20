import { registerSchema } from "schemas/register";
import { createTRPCRouter, publicProcedure } from "server/api/trpc";
import { supabase } from "server/supabase";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });
    }),
});
