import { useState } from "react"
import { getCurrentYear, getLastAndNext3Years, getMonthByIndex, getMonthIndex, getWeeksInMonthArr, isWeeksSame, monthsOfYear } from "../../../utils/dateUtils";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { useAtom, useAtomValue } from "jotai";
import { fixturesDateRangeAtom, fixturesSelectedMonthIndexAtom } from "./fixtures_calendar.atoms";
import { XIcon } from "lucide-react";
import ClearFixturesCalendarFilterButton from "./ClearFixturesCalendarFilterButton";

type Props = {
    open?: boolean,
    onClose?: () => void
}

/** Renders a clickable calendar that allows the user to select which week they want to 
 * view fixtures for!
 */
export default function FixtureListScreenCalendar({ open, onClose }: Props) {

    const [monthIndex, setMonthIndex] = useAtom(fixturesSelectedMonthIndexAtom);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useAtom(fixturesDateRangeAtom);

    const years = getLastAndNext3Years();
    const weeks = getWeeksInMonthArr(year, monthIndex);

    const onSelectWeek = (week?: Date[]) => {
        setSelectedWeek(week);
    }

    const onClearFilter = () => {
        setSelectedWeek(undefined);
    }

    const onChangeMonth = (newMonth: string) => {
        const monthIndex = getMonthIndex(newMonth);
        setMonthIndex(monthIndex);
    }

    if (!open) return;

    return (
        <div className="fixed top-0 left-0 w-[100%] h-screen overflow-hidden bg-black/60 flex flex-col items-center justify-center"  >
            
            <div className="bg-white border border-slate-200 dark:border-slate-800 gap-3 flex flex-col dark:bg-slate-900 rounded-xl p-4 w-[90%] lg:w-[50%]" >
                <div className="flex flex-row items-center justify-between" >

                    <h1>
                        Calendar
                    </h1>

                    <div className="flex flex-row gap-2 items-center justify-end" >

                        {selectedWeek && <ClearFixturesCalendarFilterButton onClearFilter={onClearFilter} />}

                        <button
                            onClick={onClose}
                            className="hover:text-slate-600 dark:hover:text-slate-400"
                        >
                            <XIcon />
                        </button>
                    </div>

                </div>

                <div className="flex gap-2 flex-row items-center justify-between" >

                    <select
                        onChange={(e) => onChangeMonth(e.target.value ?? "")}
                        className="dark:bg-slate-900 border-slate-100 dark:border-slate-800 w-full border rounded-xl px-3 py-2"
                    >
                        {monthIndex && <option>{getMonthByIndex(monthIndex)}</option>}

                        {monthsOfYear.map((m, index) => {
                            return <option key={index} value={m} >{m}</option>
                        })}

                    </select>

                    <select
                        onChange={(e) => setYear(Number.parseInt(e.target.value))}
                        className="dark:bg-slate-900 border-slate-100 dark:border-slate-800 w-full border rounded-xl px-3 py-2"
                    >

                        {years.map((m, index) => {
                            return <option key={index} value={m} >{m}</option>
                        })}

                    </select>
                </div>

                <div className="grid grid-cols-1 gap-2" >
                    {weeks.map((week, index) => {
                        return <FixtureCalendarWeek
                            week={week}
                            key={index}
                            onSelectWeek={onSelectWeek}
                        />
                    })}
                </div>

            </div>
        </div>
    )
}

type WeekProps = {
    week: Date[],
    onSelectWeek: (week?: Date[]) => void
}

export function FixtureCalendarWeek({
    week, onSelectWeek
}: WeekProps) {
    
    const selectedWeek = useAtomValue(fixturesDateRangeAtom);
    const monthIndex = useAtomValue(fixturesSelectedMonthIndexAtom);
    const isCurrent = selectedWeek !== undefined && isWeeksSame(week, selectedWeek);

    const handleClick = () => {
        if (onSelectWeek) {
            if (isCurrent) {
                onSelectWeek(undefined);
            } else {
                onSelectWeek(week);
            }
        }
    }

    return (
        <div
            onClick={handleClick}
            className={twMerge(
                "border-2 border-slate-100 gap-2 p-3 items-center justify-center rounded-xl flex flex-row dark:border-slate-800",
                "hover:bg-slate-100 dark:hover:bg-slate-800/50",
                isCurrent && "border-blue-500 dark:border-blue-600 font-bold bg-slate-100 dark:bg-slate-800 "
            )}

        >

            {week.map((day, index) => {

                const isInMonth = day.getMonth() === monthIndex;

                return (
                    <div
                        key={index}
                        className={twMerge(
                            "flex-1 flex flex-row items-center justify-center ",
                            !isInMonth && "dark:text-slate-700 text-slate-400"
                        )}
                    >
                        {format(day, "d")}
                    </div>
                )
            })}
        </div>
    )
}

