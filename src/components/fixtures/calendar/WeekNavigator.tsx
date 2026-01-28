import { twMerge } from "tailwind-merge"
import { ChevronButton } from "../../ui/buttons/ChevronButton"
import TextHeading from "../../ui/typography/TextHeading"

type Props = {
    onMovePreviousWeek?: () => void,
    onMoveNextWeek?: () => void,
    weekHeader?: string,
    className?: string
}

/** Renders a week navigator */
export default function WeekNavigator({onMoveNextWeek, onMovePreviousWeek, weekHeader, className}: Props) {
    return (
        <div className={twMerge(
            "flex flex-row items-center justify-between",
            className
        )} >
            <ChevronButton
                onClick={onMovePreviousWeek}
                disabled={false}
                direction="left"
            />

            <div className="flex flex-col items-center justify-center gap-1" >
                {/* <SecondaryText >Round 1</SecondaryText> */}
                <TextHeading blue className="">
                    {weekHeader}
                </TextHeading>
            </div>

            <ChevronButton
                onClick={onMoveNextWeek}
                disabled={false}
                direction="right"
            />
        </div>
    )
}
