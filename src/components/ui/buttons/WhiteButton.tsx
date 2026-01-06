import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "./PrimaryButton";

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void,
    disbabled?: boolean
}
export default function WhiteButton({ children, className, onClick, disbabled }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <PrimaryButton
            disbabled={disbabled}
            onClick={handleOnClick}
            className={twMerge(
                "bg-gradient-to-r border font-semibold from-white border-slate-300 to-gray-50 via-gray-50 text-primary-800",
                className
            )}
        >
            {children}
        </PrimaryButton>
    )
}
