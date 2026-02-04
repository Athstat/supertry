import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

/** Renders a circle to place an icon inside */
export default function IconCircle({ children, className }: Props) {
    return (
        <div className={twMerge(
            "bg-[#F1F3F7] dark:bg-slate-700 w-11 h-11 flex flex-col items-center justify-center rounded-full",
            className
        )} >
            {children}
        </div>
    )
}
