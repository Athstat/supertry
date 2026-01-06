import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { AppColours } from "../../types/constants"
import SegmentedControl from "../ui/SegmentedControl"
import { FixtureListViewMode } from "../../types/games"
import { format } from "date-fns"

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
    viewMode, onChangeViewMode, searchQuery, weekHeader,
    hasAnyFixtures, onMoveNextWeek, onMovePreviousWeek,
    onMoveToCurrentWeek, isCurrentWeek 
} : Props) {
    
    const handleChangeViewMode = (value: FixtureListViewMode | string) => {
        if (onChangeViewMode) {
            onChangeViewMode(value as FixtureListViewMode);
        }
    }
    
    return (
        <div>
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                    <Calendar />
                    <p className="font-bold text-xl">Pro Rugby</p>
                </div>
                <SegmentedControl
                    options={[
                        { value: 'fixtures', label: 'Fixtures' },
                        { value: 'pickem', label: "Pick'Em" },
                    ]}
                    value={viewMode}
                    onChange={handleChangeViewMode}
                />
            </div>

            {/* Sticky Date Header */}
            <div className={twMerge(
                "sticky top-14 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-white/80 backdrop-blur-sm shadow-none border-slate-200 dark:border-slate-800",
                AppColours.BACKGROUND
            )}>
                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-base md:text-lg">
                            {searchQuery ? `Search Results for '${searchQuery}'` : weekHeader}
                        </h2>
                        {!searchQuery && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Today: {format(new Date(), 'EEE, d MMM yyyy')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        {!searchQuery && hasAnyFixtures && (
                            <>
                                <button
                                    onClick={onMoveToCurrentWeek}
                                    disabled={isCurrentWeek}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Jump to current week"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm hidden sm:inline">Today</span>
                                </button>
                                <button
                                    onClick={onMovePreviousWeek}
                                    disabled={false}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="text-sm hidden sm:inline">Previous</span>
                                </button>
                                <button
                                    onClick={onMoveNextWeek}
                                    disabled={false}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="text-sm hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
