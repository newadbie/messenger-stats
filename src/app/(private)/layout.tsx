import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Header from './Header';
import { SessionContextProvider } from './SessionProvider';

export default async function PrivateLayout({ children }: Layout) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }
  if (!session.user.user_metadata.confirmed) {
    return <h1>Twoje konto nie zostało jeszcze zatwierdzone przez admina</h1>;
  }

  return (
    <SessionContextProvider session={session}>
      <Header />
      <div className="mx-auto flex w-full max-w-screen-xl flex-grow flex-col p-5">{children}</div>
    </SessionContextProvider>
  );
}
