import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    SUPABASE_URL: z.string().url(),
    SUPABASE_KEY: z.string().min(1),
    API_SECRET: z.string().min(1),
    NEXTAUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    )
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_SECRET: process.env.SUPABASE_SERVICE_ROLE_SECRET,
    API_SECRET: process.env.API_SECRET,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
