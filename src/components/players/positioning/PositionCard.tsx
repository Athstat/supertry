import { twMerge } from "tailwind-merge";
import { PositionClass } from "../../../types/athletes";
import RoundedCard from "../../shared/RoundedCard";
import { ReactNode } from "react";

type Props = {
    positionClass?: PositionClass,
    positionName?: string,
    title?: string,
    description?: string,
    showViewMoreButton?: boolean,
    onClick?: (positionClass: PositionClass) => void,
    className?: string,
    icon?: ReactNode
}

/** Renders a card that shows the top players in that position, using the athlete provider */
export default function PositionCard({ title, onClick, positionClass, className, icon }: Props) {

    const handleClick = () => {
        if (onClick && positionClass) {
            onClick(positionClass);
        }
    }

    return (
        <RoundedCard
            className={twMerge(
                "flex cursor-pointer overflow-clip p-4 dark:border-none  relative w-full h-[60px] rounded-xl flex-col gap-2",
                className
            )}
            onClick={handleClick}
        >
            <p className="font-semibold text-sm" >{title}</p>

            {<div className="absolute top-0 right-0 opacity-40 blur-xl" >
                {icon}
            </div>}
        </RoundedCard>
    )
}