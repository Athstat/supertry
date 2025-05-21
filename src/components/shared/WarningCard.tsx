import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

export default function WarningCard({children, className}: Props) {
  return (
    <div className={twMerge('bg-yellow-100  dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-900 mt-2 rounded-xl px-3 py-1 text-yellow-700 dark:text-yellow-600 flex flex-row items-center gap-1', className)} >
        {children}
    </div>
  )
}
