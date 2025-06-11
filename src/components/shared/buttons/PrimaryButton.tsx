import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void,
    disbabled?: boolean
}
export default function PrimaryButton({ children, className, onClick, disbabled }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <button
            disabled={disbabled}
            className={twMerge(
                "bg-primary-600 dark:bg-primary-600 text-white font-medium px-4 py-2 w-full items-center justify-center flex rounded-xl",
                "hover:bg-primary-700 dark:hover:bg-primary-700",
                "border border-primary-500",
                className,
                disbabled && "opacity-40"
            )}
            onClick={handleOnClick}
        >
            {children}
        </button>
    )
}
