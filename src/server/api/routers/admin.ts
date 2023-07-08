import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const adminRouter = createTRPCRouter({
  getWaitingUsers: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.user_metadata.canConfirm) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const result = await ctx.prisma.user.findMany({
      where: { raw_user_meta_data: { path: ['confirmed'], equals: false }, confirmed_at: { not: { equals: null } } },
      select: { id: true }
    });
    return result.length;
  })
});
