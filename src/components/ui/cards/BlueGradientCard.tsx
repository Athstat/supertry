import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string,
    children?: ReactNode,
    onClick?: () => void
}

export default function BlueGradientCard({ className, children, onClick } : Props) {
  return (
    <div onClick={onClick} className={twMerge(
        "bg-gradient-to-br from-[#1196F5] to-[#011E5C] rounded-2xl p-4 text-white",
        className
    )} >
        {children}
    </div>
  )
}
