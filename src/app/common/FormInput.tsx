import { useFormContext } from 'react-hook-form';

interface Props<T extends string = string> {
  name: T;
  label: string;
  placeholder?: string;
  className?: string;
  hideError?: boolean;
  type?: 'password' | 'email' | 'text';
}

const FormInput = <T extends string = string>({
  label,
  name,
  className,
  type = 'text',
  hideError,
  placeholder
}: Props<T>): JSX.Element => {
  const { register, formState } = useFormContext();
  const errorMessage = formState.errors[name]?.message;

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
        {...register(name)}
      />
      {!hideError && errorMessage && (
        <p className="mt-2 h-3 text-xs text-red-500">{typeof errorMessage === 'string' ? errorMessage : ''}</p>
      )}
    </div>
  );
};

export default FormInput;
