import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

/** Renders a pill tag component */
export default function PillTag({children, className} : Props) {
  return (
    <div className={twMerge(
        "bg-slate-200 px-2 py-0.5 rounded-xl dark:bg-slate-700/50",
        className
    )} >
        {children}
    </div>
  )
}
