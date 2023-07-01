'use client';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

import { cn } from 'utils/cn';

interface IOption {
  value: string;
  label: string;
}

interface IProps<T extends string = string> {
  name: T;
  label?: string;
  className?: string;
  options: IOption[];
  hideError?: boolean;
}

const FormSelect = <T extends string = string>({
  name,
  className,
  label,
  options,
  hideError
}: IProps<T>): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const { field, formState } = useController({ name });
  const [selectedLabel, setSelectedLabel] = useState<string>((field.value?.label as string) ?? 'Wybierz wartość');

  const errorMessage = formState.errors?.[name]?.message;
  const setCorrectPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const validLeftPosition =
      rect.left + rect.width > window.innerWidth ? window.innerWidth - rect.width - 20 : rect.left;
    setPosition({
      top: rect.top + 40,
      left: validLeftPosition,
      width: rect.width
    });
  };

  useEffect(() => {
    setCorrectPosition();
    window.addEventListener('resize', setCorrectPosition);
    return () => window.removeEventListener('resize', setCorrectPosition);
  }, []);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="font-mediumtext-white mb-2 block text-sm">
          {label}
        </label>
      )}
      <Listbox
        defaultValue={field.value ?? { label: selectedLabel, value: '' }}
        onChange={(e: IOption) => {
          setSelectedLabel(e.label);
          field.onChange(e.value as Parameters<typeof field.onChange>[0]);
        }}
      >
        <div className="relative mt-1">
          <Listbox.Button
            onClick={setCorrectPosition}
            ref={buttonRef}
            className="borderbg-gray-50 block w-full rounded-lg border-gray-600 bg-gray-700 p-2.5 text-left text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          >
            <span
              className={cn('truncate', {
                'text-white/80': !field.value
              })}
            >
              {selectedLabel}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options
              style={{
                top: position.top,
                left: position.left,
                width: position.width
              }}
              className="fixed z-10 mt-1 block max-h-60 w-full overflow-auto rounded-lg border border-gray-600 bg-gray-700 p-2.5 px-0 py-1 text-left text-sm text-white placeholder-gray-400 shadow-lg focus:outline-none sm:text-sm"
            >
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    cn('relative cursor-pointer select-none py-2 pl-10 pr-4 text-white/80', {
                      'bg-gray-600 text-black': active
                    })
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {!hideError && typeof errorMessage === 'string' && (
        <p className="mt-2 h-3 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default FormSelect;
