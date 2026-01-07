import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  children?: ReactNode,
  className?: string,
  onClick?: () => void
}

export default function WarningCard({ children, className, onClick }: Props) {
  return (
    <div onClick={onClick} role="alert" className={twMerge('bg-yellow-100   dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-900 mt-2 rounded-xl px-3 py-1 text-yellow-600 dark:text-yellow-600 flex flex-row items-center gap-1', className)} >
      {children}
    </div>
  )
}

export function BlueInfoCard({ children, className, onClick }: Props) {
  return (
    <div onClick={onClick} className={twMerge('bg-blue-100   dark:bg-blue-900/20 border border-blue-300 dark:border-primary-800 mt-2 rounded-xl px-3 py-1 text-blue-600 dark:text-blue-200 flex flex-row items-center gap-1', className)} >
      {children}
    </div>
  )
}
