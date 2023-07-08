import { type SupabaseClient, createClient } from '@supabase/supabase-js';

import { env } from 'env.mjs';

const globalForPrisma = globalThis as unknown as {
  supabase: SupabaseClient | undefined;
};

export const supabase =
  globalForPrisma.supabase ??
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_SECRET, { auth: { persistSession: false } });

if (env.NODE_ENV !== 'production') globalForPrisma.supabase = supabase;
