import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { AppColours } from "../../../types/constants"

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void,
    dataTutorial?: string
}

/** Renders a rounded card with both light mode and dark mode support */
export default function RoundedCard({children, className, onClick, dataTutorial} : Props) {
    
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    }
    
    return (

        <div
            onClick={handleClick}
            data-tutorial={dataTutorial}
            className={twMerge(
                "bg-white dark:text-white dark:hover:text-slate-50 border border-slate-300 dark:border-slate-800 rounded-[5px] transition-all",
                AppColours.CARD_BACKGROUND,
                className
            )}
        >
            {children}
        </div>

    )
}
