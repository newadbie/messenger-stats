'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CustomButton from 'app/common/CustomButton';
import { api } from 'utils/api';

import { useSession } from './SessionProvider';

const Header: React.FC = () => {
  const session = useSession();
  const { data } = api.admin.getWaitingUsers.useQuery(undefined, { enabled: session.user.user_metadata.canConfirm });
  const pathname = usePathname();

  return (
    <header>
      <nav className="border-gray-200 bg-gray-800">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2.5 md:px-6">
          <span className="whitespace-nowrap text-xl font-semibold text-white">Mess stats</span>
          <div className="flex items-center gap-6">
            {session.user.user_metadata.canConfirm && (
              <CustomButton
                href="/uzytkownicy"
                size="xs"
                className="relative"
                outline
                text={
                  <>
                    <span className="relative z-20">Użytkownicy</span>
                    {!!data && (
                      <div className="absolute -bottom-2 -left-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-900 bg-red-500 text-xs font-bold text-white">
                        {data}
                      </div>
                    )}
                  </>
                }
              />
            )}
            {pathname !== '/statystyki' ? (
              <Link href="/statystyki" className="text-sm font-medium text-primary-500 hover:underline">
                Statystyki
              </Link>
            ) : (
              <Link href="/statystyki/dodaj-json" className="text-sm font-medium text-primary-500 hover:underline">
                Dodaj JSON
              </Link>
            )}
            <form action="/api/auth/signout" method="post">
              <button className="hidden text-sm font-medium text-primary-500 hover:underline sm:inline">Wyloguj</button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
