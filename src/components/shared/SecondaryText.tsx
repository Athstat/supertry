import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

export default function SecondaryText({children, className} : Props) {
  return (
    <p className={twMerge(
        "text-slate-500 dark:text-slate-400 text-sm",
        className
    )} >
        {children}
    </p>
  )
}
