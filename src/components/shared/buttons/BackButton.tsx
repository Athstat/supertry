import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    className?: string,
    onClick?: () => void,
    children?: ReactNode
}

/** Renders a circle button UI */
export default function CircleButton({ className, onClick, children }: Props) {
    return (
        <button
            className={twMerge(
                "flex flex-col items-center justify-center overflow-clip",
                "bg-slate-200 hover:bg-slate-300 rounded-full w-12 h-12 text-slate-700",
                "dark:bg-slate-800/60 hover:dark:bg-slate-800 dark:text-white",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
