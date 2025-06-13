import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string,
    children?: ReactNode
}

export default function BlueGradientCard({ className, children } : Props) {
  return (
    <div className={twMerge(
        "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 rounded-2xl p-4 text-white",
        className
    )} >
        {children}
    </div>
  )
}
