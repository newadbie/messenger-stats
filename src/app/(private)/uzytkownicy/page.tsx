import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import React from 'react';

import UsersTable from './UsersTable';

export const metadata: Metadata = {
  title: 'Potwierdź nowych'
};

// Last two is for buttons

export default async function ConfirmUsersPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user.user_metadata.canConfirm) {
    return <h1>Nie masz dostępu do tej strony</h1>;
  }

  return (
    <div>
      <h1 className="heading-3 mb-4 text-center">Potwierdź nowych użytkowników</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <UsersTable />
      </div>
    </div>
  );
}
