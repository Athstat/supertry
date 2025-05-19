import { useEffect, useState } from "react"
import { getLastAndNext3Years, getWeeksInMonthArr, isWeeksSame, Month, monthsOfYear, weekHash } from "../../../utils/dateUtils";
import { format, getWeek, getWeeksInMonth } from "date-fns";
import { twMerge } from "tailwind-merge";

type Props = {
    open?: boolean
}

export default function FixtureCalendarInput({ open }: Props) {

    const now = new Date();
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [dateRange, setDateRange] = useState<[number, number]>();
    const [selectedWeek, setSelectedWeek] = useState<Date[]>();

    const years = getLastAndNext3Years().filter(y => y !== year);
    const weeks = getWeeksInMonthArr(year, month);

    const onSelectWeek = (week: Date[]) => {
        setSelectedWeek(week);
    }

    if (!true) return;

    return (
        <div className="fixed mt-16 w-[100%] flex flex-col items-center justify-center"  >
            <div className="bg-slate-100 gap-3 flex flex-col dark:bg-black rounded-xl p-4 w-[90%] lg:w-[75%]" >
                Fixture Calendar Input

                <div className="flex gap-2 flex-row items-center justify-between" >

                    <select className="dark:bg-black border-slate-100 dark:border-slate-800 w-full border rounded-xl px-3 py-1" >
                        {monthsOfYear.map((m, index) => {
                            return <option key={index} value={m} >{m}</option>
                        })}
                    </select>

                    <select className="dark:bg-black w-full border-slate-100 dark:border-slate-800 border rounded-xl px-3 py-1" >
                        {<option value={year} >{year}</option>}
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
                            year={year}
                            month={month}
                            onSelectWeek={onSelectWeek}
                            isCurrent={selectedWeek !== undefined && isWeeksSame(week, selectedWeek)}
                        />
                    })}
                </div>

            </div>
        </div>
    )
}

type WeekProps = {
    week: Date[],
    year: number,
    month: number,
    onSelectWeek: (week: Date[]) => void,
    isCurrent?: boolean
}

export function FixtureCalendarWeek({
    week, month, onSelectWeek, isCurrent
}: WeekProps) {

    const handleClick = () => {
        if (onSelectWeek) {
            onSelectWeek(week);
        }
    }

    return (
        <div
            onClick={handleClick}
            className={twMerge(
                "border border-slate-100 gap-2 p-3 items-center justify-center rounded-xl flex flex-row dark:border-slate-800",
                "hover:bg-slate-200 dark:hover:bg-slate-800/50",
                isCurrent && "border-blue-500 dark:border-blue-600"
            )} 
            
            >

            {week.map((day, index) => {

                const isInMonth = day.getMonth() === month;

                return (
                    <div
                        key={index}
                        className={twMerge(
                            "flex-1 flex flex-row items-center justify-center ",
                            !isInMonth && "dark:text-slate-700 text-slate-700"
                        )}
                    >
                        {format(day, "d")}
                    </div>
                )
            })}
        </div>
    )
}
