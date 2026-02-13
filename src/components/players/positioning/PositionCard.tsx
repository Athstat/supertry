import { twMerge } from "tailwind-merge";
import { PositionClass } from "../../../types/athletes";
import { ReactNode } from "react";
import RoundedCard from "../../ui/cards/RoundedCard";

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
                "flex cursor-pointer overflow-clip p-4 dark:border-none  relative w-full h-[60px] flex-col gap-2",
                className
            )}
            onClick={handleClick}
        >
            <p className="text-sm" >{title}</p>

            {<div className="absolute top-0 right-0 opacity-0" >
                {icon}
            </div>}
        </RoundedCard>
    )
}