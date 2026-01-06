import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { AppColours } from "../../types/constants"

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void
}

/** Renders a rounded card with both light mode and dark mode support */
export default function RoundedCard({children, className, onClick} : Props) {
    
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    }
    
    return (

        <div
            onClick={handleClick}
            className={twMerge(
                "bg-white dark:text-white dark:hover:text-slate-50  dark:hover:bg-slate-800/50 border border-slate-300 dark:border-slate-800 rounded-2xl transition-all",
                AppColours.CARD_BACKGROUND,
                className
            )}
        >
            {children}
        </div>

    )
}
