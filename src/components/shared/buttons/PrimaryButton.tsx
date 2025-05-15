import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void
}
export default function PrimaryButton({ children, className, onClick }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <button
            className={twMerge(
                "bg-primary-600 text-white font-semibold px-4 py-2 w-full items-center justify-center flex rounded-xl",
                "hover:bg-primary-700",
                className
            )}
            onClick={handleOnClick}
        >
            {children}
        </button>
    )
}
