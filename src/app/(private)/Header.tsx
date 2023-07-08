'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from './SessionProvider';

const Header: React.FC = () => {
  const session = useSession();
  const pathname = usePathname();

  return (
    <header>
      <nav className="border-gray-200 bg-gray-800">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2.5 md:px-6">
          <span className="whitespace-nowrap text-xl font-semibold text-white">Mess stats</span>
          <div className="flex items-center">
            {session.user.user_metadata.canConfirm && (
              <Link className="text-sm font-medium text-primary-500 hover:underline sm:mr-6" href="/potwierdz-nowych">
                Potwierdź nowych
              </Link>
            )}
            {pathname !== '/statystyki' ? (
              <Link href="/statystyki" className="text-sm font-medium text-primary-500 hover:underline sm:mr-6">
                Statystyki
              </Link>
            ) : (
              <Link
                href="/statystyki/dodaj-json"
                className="text-sm font-medium text-primary-500 hover:underline sm:mr-6"
              >
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
