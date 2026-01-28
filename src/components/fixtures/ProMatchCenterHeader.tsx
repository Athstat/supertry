import { twMerge } from "tailwind-merge"
import { AppColours } from "../../types/constants"
import WeekNavigator from "./calendar/WeekNavigator"

type Props = {
    searchQuery?: string,
    weekHeader?: string,
    hasAnyFixtures?: boolean,
    onMoveToCurrentWeek: () => void,
    onMoveNextWeek: () => void,
    onMovePreviousWeek: () => void,
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

                <WeekNavigator 
                    onMoveNextWeek={onMoveNextWeek}
                    onMovePreviousWeek={onMovePreviousWeek}
                    weekHeader={weekHeader}
                />

            </div>
        </div>
    )
}

