'use client';
import { cn } from 'utils/cn';

interface Props {
  variant?: 'default' | 'dark' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink';
  text: string;
}

const Badge: React.FC<Props> = ({ variant = 'default', text }) => (
  <span
    className={cn('mr-2 rounded px-2.5 py-0.5 text-sm font-medium', {
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': variant === 'default',
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': variant === 'dark',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': variant === 'red',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': variant === 'green',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': variant === 'yellow',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300': variant === 'indigo',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': variant === 'purple',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300': variant === 'pink'
    })}
  >
    {text}
  </span>
);

export default Badge;
