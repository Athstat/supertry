import { twMerge } from "tailwind-merge"
import { ChevronButton } from "../../ui/buttons/ChevronButton"
import TextHeading from "../../ui/typography/TextHeading"
import SecondaryText from "../../ui/typography/SecondaryText"

type Props = {
    onMovePreviousWeek?: () => void,
    onMoveNextWeek?: () => void,
    weekHeader?: string,
    className?: string,
    round?: number
}

/** Renders a week navigator */
export default function WeekNavigator({ onMoveNextWeek, onMovePreviousWeek, weekHeader, className, round }: Props) {
    return (
        <div className={twMerge(
            "flex flex-col items-center justify-center w-full",
            className
        )} >

            {/* Avoiding layout shift */}
            
            <SecondaryText
                className={twMerge(
                    !round && 'text-transparent dark:text-transparent'
                )}
            >
                {round ? `Round ${round}` : "Round"}
            </SecondaryText>

            <div className={"flex flex-row items-center justify-between w-full"} >
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
        </div>
    )
}
