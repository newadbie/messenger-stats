'use client';
import { type UserMetadata } from '@supabase/supabase-js';

import { api } from 'utils/api';

import ActionButtons from './ActionButtons';
import StatusBadge from './StatusBadge';

const COLUMNS = ['Nazwa', 'Email', 'Status', '', ''] as const;

const UsersTable: React.FC = () => {
  const { data: users } = api.admin.getUsers.useQuery();

  //   TODO: loading state, + behavior when no users

  return (
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
        {users?.map((user) => {
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
                  <ActionButtons userId={user.id} canBeConfirmed={!metadata.confirmed && !!user.confirmed_at} />
                </div>
              </th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsersTable;
