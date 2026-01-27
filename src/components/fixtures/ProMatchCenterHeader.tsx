import { ChevronLeft, ChevronRight } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { AppColours } from "../../types/constants"
import { FixtureListViewMode } from "../../types/games"
import TextHeading from "../ui/typography/TextHeading"

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

type ChevronButtonProps = {
    onClick?: () => void,
    direction?: "left" | "right",
    disabled?: boolean
}

function ChevronButton({ onClick, direction = "left", disabled = false }: ChevronButtonProps) {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#DAEAF7] dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_3px_rgba(0,0,0,0.30)]"
        >
            {/* <span className="text-sm hidden sm:inline">Next</span> */}
            {direction === "left" && <ChevronLeft className="h-7 w-7 text-[#1196F5]" />}
            {direction === "right" && <ChevronRight className="h-7 w-7 text-[#1196F5]" />}
        </button>
    )

}