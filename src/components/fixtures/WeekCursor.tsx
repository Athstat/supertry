import { twMerge } from "tailwind-merge"
import ChevronButton from "../ui/buttons/ChevronButton"
import SecondaryText from "../ui/typography/SecondaryText"
import TextHeading from "../ui/typography/TextHeading"

type Props = {
    weekHeader?: string,
    onNext?: () => void,
    onPrevious?: () => void,
    roundNumber?: number,
    className?: string
}

export default function WeekCursor({ weekHeader, onNext, onPrevious, roundNumber, className }: Props) {
    return (
        <div className={twMerge(
            "flex flex-col items-center justify-center w-full",
            className
        )} >
            <div>
                {roundNumber && <SecondaryText>Round {roundNumber}</SecondaryText>}
            </div>

            <div className="flex flex-row items-center justify-between w-full" >
                <ChevronButton
                    direction="left"
                    onClick={onPrevious}
                />

                <TextHeading>{weekHeader}</TextHeading>

                <ChevronButton
                    direction="right"
                    onClick={onNext}
                />
            </div>
        </div>
    )
}
