import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { prisma } from 'server/db';

export const metadata: Metadata = {
  title: 'Potwierdź nowych'
};

export default async function ConfirmUsersPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user.user_metadata.canConfirm) {
    return <h1>Nie masz dostępu do tej strony</h1>;
  }

  return <h1>Page in progress</h1>;
}
