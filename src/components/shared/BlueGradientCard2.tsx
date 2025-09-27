import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

export default function BlueGradientCard2({ className, children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 dark:from-pink-600 dark:via-pink-700 dark:to-pink-800 rounded-2xl p-4 text-white',
        className
      )}
    >
      {children}
    </div>
  );
}
