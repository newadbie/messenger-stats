import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

import { cn } from 'utils/cn';

interface Props<T extends string = string> {
  name: T;
  label?: string;
  hideError?: boolean;
}

const FormDropzone = <T extends string = string>({ name, hideError, label }: Props<T>): JSX.Element => {
  const { field, formState } = useController({ name: name as string });
  const errorMessage = formState.errors[name]?.message;

  const onDrop = useCallback(
    <T extends File>(acceptedFiles: T[]) => {
      const [file] = acceptedFiles;
      if (!file) return;
      field.onChange(file);
      field.onBlur();
    },
    [field]
  );

  const handleRemoveFile = () => {
    field.onChange(undefined);
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    multiple: false
  });
  const file = acceptedFiles[0];

  if (file && !errorMessage) {
    return (
      <div>
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-white">
          {label}
        </label>
        <div className="flex">
          <input
            type="text"
            className="block w-full cursor-not-allowed rounded-lg rounded-r-none border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-400 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            readOnly
            value={file.name}
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-600 bg-gray-600 px-3 text-sm text-gray-400"
          >
            X
          </button>
        </div>
        {!hideError && errorMessage && (
          <p className="mt-2 h-3 text-xs text-red-500">{typeof errorMessage === 'string' ? errorMessage : ''}</p>
        )}
      </div>
    );
  }

  return (
    <>
      {label && <span className="mb-2 block text-sm font-medium text-white">{label}</span>}
      <div className="flex w-full flex-col justify-center" {...getRootProps()}>
        <label
          htmlFor={name}
          className={cn(
            'hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600',
            { 'order-gray-500 bg-gray-600': isDragActive }
          )}
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
          <input name={name} type="file" className="hidden" {...getInputProps()} />
        </label>
        {!hideError && errorMessage && (
          <p className="mt-2 h-3 text-xs text-red-500">{typeof errorMessage === 'string' && errorMessage}</p>
        )}
      </div>
    </>
  );
};

export default FormDropzone;
