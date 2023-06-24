import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "server/db";
import { type NextRequest } from "next/server";

type CreateContextOptions = {
  //can be null
};

const createInnerTRPCContext = (_opts?: CreateContextOptions) => {
  return {
    prisma,
  };
};

export const createTRPCContext = (_req: NextRequest) => {
  try {
    return createInnerTRPCContext();
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
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
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
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
