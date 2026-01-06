import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: string,
    onClick?: () => void,
    iconSize?: number,
    highlight?: boolean
}

/** Renders a close button */
export default function CloseButton({ className, onClick, iconSize = 20, highlight }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <button
            onClick={handleOnClick}
            className={twMerge(
                "p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-400",
                highlight && "bg-slate-200 dark:bg-dark-800/50",
                className
            )}
        >
            <X size={iconSize} />
        </button>
    )
}
