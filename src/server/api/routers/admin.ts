import { TRPCError } from '@trpc/server';

import { confirmUserSchema, deleteUserSchema } from 'schemas/adminSchemas';
import { supabase } from 'server/supabase';

import { createTRPCRouter, adminProcedure } from '../trpc';

export const adminRouter = createTRPCRouter({
  getWaitingUsers: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.user.findMany({
      where: { raw_user_meta_data: { path: ['confirmed'], equals: false }, confirmed_at: { not: { equals: null } } },
      select: { id: true }
    });
    return result.length;
  }),
  getUsers: adminProcedure.query(async ({ ctx }) =>
    ctx.prisma.user.findMany({
      where: { id: { not: { equals: ctx.session.user.id } } },
      select: { id: true, raw_user_meta_data: true, email: true, confirmed_at: true }
    })
  ),
  confirmUser: adminProcedure.input(confirmUserSchema).mutation(async ({ input, ctx }) => {
    await supabase.auth.admin.updateUserById(input.userId, { user_metadata: { confirmed: true } });
  }),
  deleteUser: adminProcedure.input(deleteUserSchema).mutation(async ({ input, ctx }) => {
    const result = await supabase.auth.admin.deleteUser(input.userId);
    if (result.error) {
      console.log(result.error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  })
});
