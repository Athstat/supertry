import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string,
    children?: ReactNode
}

export default function BlueGradientCard({ className, children } : Props) {
  return (
    <div className={twMerge(
        "bg-gradient-to-br from-primary-700 to-primary-800 via-primary-900 rounded-2xl p-4 text-white",
        className
    )} >
        {children}
    </div>
  )
}
