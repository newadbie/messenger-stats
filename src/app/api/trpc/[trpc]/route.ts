import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { env } from 'env.mjs';
import { appRouter } from 'server/api/root';
import { createTRPCContext } from 'server/api/trpc';

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? ''}: ${JSON.stringify(error)}`);
          }
        : undefined
  });
};

export { handler as GET, handler as POST };
