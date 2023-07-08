import { TRPCError } from '@trpc/server';

import { registerSchema } from 'schemas/register';
import { createTRPCRouter, publicProcedure } from 'server/api/trpc';
import { supabase } from 'server/supabase';

export const authRouter = createTRPCRouter({
  register: publicProcedure.input(registerSchema).mutation(async ({ input }) => {
    const response = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { username: input.username, confirmed: false, canConfirm: false } }
    });
    if (response.error) {
      console.log(response.error.message);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  })
});
