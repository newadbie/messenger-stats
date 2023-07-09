import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';

import AddForm from './AddForm';

export const metadata: Metadata = {
  title: 'Dodaj statystyki'
};

export default function AddPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="heading-3 mb-2">Wgraj plik JSON</h1>
      <AddForm />
    </div>
  );
}
