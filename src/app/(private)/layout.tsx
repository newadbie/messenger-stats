import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from 'server/db';

import SignoutBtn from './SignoutBtn';

export default async function PrivateLayout({ children }: Layout) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) {
    redirect('/');
  }

  try {
    const { confirmed } = await prisma.userDetails.findUniqueOrThrow({
      where: { userId: session.user.id },
      select: { confirmed: true }
    });
    if (!confirmed) {
      return <h1>Twoje konto nie zostało jeszcze zatwierdzone przez admina</h1>;
    }
  } catch {
    return <h1>Nastąpił jakiś bład</h1>;
  }

  return (
    <>
      <SignoutBtn />
      {children}
    </>
  );
}
