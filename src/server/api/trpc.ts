import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { initTRPC } from '@trpc/server';
import { cookies } from 'next/headers';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { prisma } from 'server/db';

export const createTRPCContext = async () => {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user.id) {
      return { supabase, prisma, session: null };
    }
    const userDetails = await prisma.userDetail.findUnique({ where: { userId: session.data.session.user.id } });
    return { supabase, prisma, session: { ...session.data.session.user, ...userDetails } };
  } catch (e) {
    throw e;
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  // if (!ctx.session || !ctx.session.user) {
  //   throw new TRPCError({ code: "UNAUTHORIZED" });
  // }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      // session: { ...ctx.session, user: ctx.session.user },
    }
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
