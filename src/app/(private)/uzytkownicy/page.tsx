import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type UserMetadata } from '@supabase/supabase-js';
import { Badge } from 'flowbite-react';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react';

import CustomButton from 'app/common/CustomButton';
import { prisma } from 'server/db';

import StatusBadge from './StatusBadge';

export const metadata: Metadata = {
  title: 'Potwierdź nowych'
};

// Last two is for buttons
const COLUMNS = ['Nazwa', 'Email', 'Status', '', ''] as const;

export default async function ConfirmUsersPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user.user_metadata.canConfirm) {
    return <h1>Nie masz dostępu do tej strony</h1>;
  }

  const users = await prisma.user.findMany({
    where: { id: { not: { equals: session.user.id } } },
    select: { id: true, raw_user_meta_data: true, email: true, confirmed_at: true }
  });

  if (users.length === 0) {
    return <h1>Nie użytkowników</h1>;
  }

  return (
    <div>
      <h1 className="heading-3 mb-2">Potwierdź nowych użytkowników</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-700 text-xs uppercase text-gray-400">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-6 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const metadata = user.raw_user_meta_data as UserMetadata;
              return (
                <tr key={user.id} className="border-b border-gray-700 bg-gray-800">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    {metadata.username}
                  </th>
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    {user.email}
                  </th>
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    <StatusBadge emailConfirmed={!!user.confirmed_at} userConfirmed={!!metadata.confirmed} />
                  </th>
                  <th scope="row" colSpan={2} className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    <div className="flex w-full gap-4">
                      {!metadata.confirmed && !user.confirmed_at && <CustomButton text="Potwierdź" size="sm" />}
                      {!metadata.confirmed && !user.confirmed_at && (
                        <CustomButton text="Usuń" size="sm" variant="red" />
                      )}
                    </div>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
