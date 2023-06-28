import { Toaster } from 'sonner';
import AddForm from './AddForm';

export default function AddPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="mb-2">Wgraj plik JSON</h1>
      <AddForm />
      <Toaster />
    </div>
  );
}
