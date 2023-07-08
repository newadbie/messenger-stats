import { createTRPCRouter } from 'server/api/trpc';

import { adminRouter } from './routers/admin';
import { authRouter } from './routers/auth';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
