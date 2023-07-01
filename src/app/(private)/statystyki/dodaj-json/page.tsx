import AddForm from './AddForm';

export default function AddPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="heading-3 mb-2">Wgraj plik JSON</h1>
      <AddForm />
    </div>
  );
}
