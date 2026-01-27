import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void
}

export default function SecondaryButton({children, className, onClick} : Props) {
  return (
    <button
        onClick={onClick}
        className={twMerge(
            "border border-white px-2 py-3 rounded-md bg-gradient-to-r from-[#00000080] to-[#011E5C80]",
            className
        )}
    >
        {children}
    </button>
  )
}
