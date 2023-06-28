import { useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

interface Props<T extends string = string> {
  name: T;
  label?: string;
  hideError?: boolean;
}

const FormDropzone = <T extends string = string>({ name }: Props<T>): JSX.Element => {
  const { field, formState } = useController({ name: name as string });
  const errorMessage = formState.errors[name]?.message;
  console.log(errorMessage, 'em');

  const onDrop = useCallback(
    <T extends File>(acceptedFiles: T[]) => {
      const [file] = acceptedFiles;
      console.log(file);
      if (!file) return;
      field.onChange(file);
    },
    [field]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            aria-hidden="true"
            className="mb-3 h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
      </label>
      {errorMessage && <>{errorMessage}</>}
    </div>
  );
};

export default FormDropzone;
