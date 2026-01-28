import { ChevronButton } from "../../ui/buttons/ChevronButton"
import TextHeading from "../../ui/typography/TextHeading"

type Props = {
    onMovePreviousWeek?: () => void,
    onMoveNextWeek?: () => void,
    weekHeader?: string
}

/** Renders a week navigator */
export default function WeekNavigator({onMoveNextWeek, onMovePreviousWeek, weekHeader}: Props) {
    return (
        <div className="flex flex-row items-center justify-between" >
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
