import { PositionClass } from "../../../types/athletes";
import RoundedCard from "../../shared/RoundedCard";

type Props = {
    positionClass?: PositionClass,
    positionName?: string,
    title?: string,
    description?: string,
    showViewMoreButton?: boolean
}

/** Renders a card that shows the top players in that position, using the athlete provider */
export default function PositionCard({ title }: Props) {

    return (
        <RoundedCard className="flex cursor-pointer p-4 dark:border-none  relative w-full h-[60px] rounded-xl flex-col gap-2" >
            <p className="font-semibold text-sm" >{title}</p>

            {/* <div>
                <SecondaryText className="text-xs" >{len} Players</SecondaryText>
            </div> */}
        </RoundedCard>
    )
}