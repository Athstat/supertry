import { ReactNode } from "react"
import SecondaryText from "../typography/SecondaryText"
import { twMerge } from "tailwind-merge"

type Props = {
    lable?: string,
    icon?: ReactNode,
    className?: string,
    onClick?: () => void
}

/** Renders a grid button */
export default function GridButton({ icon, lable, className, onClick }: Props) {
    return (
        <button
            className={twMerge(
                "flex flex-col items-center drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] justify-center p-4 gap-2 rounded-md bg-[#F0F3F7]",
                className
            )}

            onClick={onClick}
        >
            <SecondaryText className="text-[#011E5C] text-base" >{lable}</SecondaryText>
            {icon}
        </button>
    )
}
