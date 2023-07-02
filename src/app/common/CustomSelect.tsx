'use client';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useRef, useState } from 'react';

import { cn } from 'utils/cn';

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  defaultOption?: CustomSelectOption;
  className?: string;
  options: CustomSelectOption[];
  onChange: (value: CustomSelectOption) => void;
}

const CustomSelect: React.FC<Props> = ({ className, defaultOption, label, options, onChange }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [currentOption, setCurrentOption] = useState(defaultOption);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const handleChange = (option: CustomSelectOption) => {
    setCurrentOption(option);
    onChange(option);
  };

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
      {label && <label className="mb-2 block text-sm font-medium text-white">{label}</label>}
      <Listbox onChange={handleChange} defaultValue={defaultOption}>
        <div className="relative mt-1">
          <Listbox.Button
            onClick={setCorrectPosition}
            ref={buttonRef}
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-left text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          >
            <span
              className={cn('truncate', {
                'text-white/80': !currentOption?.value
              })}
            >
              {currentOption?.label ?? 'Wybierz'}
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
                      'bg-gray-600 text-white': active
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
    </div>
  );
};

export default CustomSelect;
