import { twMerge } from "tailwind-merge"
import { AppColours } from "../../types/constants"
import { FixtureListViewMode } from "../../types/games"
import TextHeading from "../ui/typography/TextHeading"
import { ChevronButton } from "../ui/buttons/ChevronButton"

type Props = {
    viewMode: FixtureListViewMode,
    onChangeViewMode?: (mode: FixtureListViewMode) => void,
    searchQuery?: string,
    weekHeader?: string,
    hasAnyFixtures?: boolean,
    onMoveToCurrentWeek: () => void,
    onMoveNextWeek: () => void,
    onMovePreviousWeek: () => void,
    isCurrentWeek?: boolean
}

/** Renders the Header for the fixture screen */
export default function ProMatchCenterHeader({
    searchQuery, weekHeader,
    hasAnyFixtures, onMoveNextWeek, onMovePreviousWeek,
}: Props) {

    if (searchQuery || !hasAnyFixtures) {
        return;
    }

    return (
        <div>
            {/* Sticky Date Header */}
            <div className={twMerge(
                "sticky top-14 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3  backdrop-blur-sm shadow-none border-slate-200 dark:border-slate-800",
                AppColours.BACKGROUND,
                "bg-[#F0F3F7]"
            )}>

                <div className="flex flex-row items-center justify-between w-full " >

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
        </div>
    )
}

