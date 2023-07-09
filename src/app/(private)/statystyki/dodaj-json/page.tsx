import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';

import AddForm from './AddForm';

export const metadata: Metadata = {
  title: 'Dodaj statystyki'
};

export default async function AddPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user.user_metadata.canConfirm) {
    return (
      <>
        <h1>Nie masz uprawnień do tej strony</h1>
        <p>W przyszłości będziesz mieć tylko muszę ogarnąć podwójne dodawnie plików</p>
      </>
    );
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="heading-3 mb-2">Wgraj plik JSON</h1>
      <AddForm />
    </div>
  );
}
