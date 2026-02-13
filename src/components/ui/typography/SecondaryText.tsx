import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

export default function SecondaryText({children, className} : Props) {
  return (
    <p className={twMerge(
        "text-[#475569] dark:text-slate-300 text-sm",
        className
    )} >
        {children}
    </p>
  )
}
