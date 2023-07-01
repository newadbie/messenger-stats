'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header>
      <nav className="border-gray-200 bg-gray-800">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2.5 md:px-6">
          <span className="whitespace-nowrap text-xl font-semibold text-white">Mess stats</span>
          <div className="flex items-center">
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
            <button
              onClick={handleSignOut}
              className="hidden text-sm font-medium text-primary-500 hover:underline sm:inline"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
