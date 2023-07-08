import { UserMetadata as _UserMetadata } from '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface UserMetadata {
    username?: string;
    confirmed?: boolean;
    canConfirm?: boolean;
  }
}
