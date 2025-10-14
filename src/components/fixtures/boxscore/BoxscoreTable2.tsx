import { twMerge } from "tailwind-merge"
import { BoxscoreHeader, BoxscoreListRecordItem } from "../../../types/boxScore"
import BoxscoreTableProvider, { useBoxscoreTable } from "./BoxscoreTableProvider"
import SecondaryText from "../../shared/SecondaryText"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService"
import RoundedCard from "../../shared/RoundedCard"

type Props = {
    title?: string,
    columns: BoxscoreHeader[],
    records: BoxscoreListRecordItem[],
    noContentMessage?: string
}

/** Renders an ESPN like boxscore Table */
export default function BoxscoreTable2({ title, columns, records, noContentMessage }: Props) {
    return (
        <BoxscoreTableProvider
            columns={columns}
            tableTitle={title}
            records={records}
            noContentMessage={noContentMessage}
        >
            <InnerTable />
        </BoxscoreTableProvider>
    )
}

function InnerTable() {

    const { title, firstColumn, secondaryColumns, records } = useBoxscoreTable();

    return (
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            {/* Team Header */}
            {title && (
                <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                    <p className="font-semibold text-base">{title}</p>
                    {/* <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        All Stats
                    </button> */}
                </div>
            )}

            {/* Table Container */}
            <div className="w-full flex flex-col overflow-x-auto bg-white dark:bg-slate-800">
                {/* Table Header */}
                <div className="h-[44px] w-full min-w-fit flex flex-row items-center border-b border-slate-200 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/40">
                    {firstColumn && (
                        <TableColumn
                            column={firstColumn}
                            className="w-[180px] min-w-[180px] bg-slate-50 dark:bg-[#1E293B] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-700/40"
                        />
                    )}

                    {secondaryColumns.map((column, index) => {
                        return (
                            <TableColumn
                                key={column.key || index}
                                column={column}
                                className="flex-1 min-w-[60px] justify-center"
                            />
                        )
                    })}
                </div>

                {/* Table Body */}
                <div className="flex w-full min-w-fit flex-col">
                    {records.map((record, index) => {
                        return (
                            <TableRecord
                                key={record.athleteId || index}
                                record={record}
                                index={index}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


type TableColumnProps = {
    column: BoxscoreHeader,
    className?: string
}
function TableColumn({ column, className }: TableColumnProps) {
    return (
        <div
            className={twMerge(
                'px-3 py-2 h-full flex flex-row items-center justify-start',
                className
            )}
        >
            <SecondaryText className="font-bold text-xs uppercase tracking-wide">{column.lable}</SecondaryText>
        </div>
    )
}

type TableRecordProps = {
    record: BoxscoreListRecordItem,
    index: number,
    className?: string
}

function TableRecord({ record, index, className }: TableRecordProps) {

    const { athleteId } = record;
    const key = `/athletes/${athleteId}`;
    const { data: info, isLoading: loadingInfo, } = useSWR(key, () => djangoAthleteService.getAthleteById(athleteId), {
        revalidateOnFocus: false
    });

    const [show, setShow] = useState(true);

    useEffect(() => {

        if (!info && !loadingInfo) {
            setShow(false);
        }

    }, [info, setShow, loadingInfo]);

    if (loadingInfo) {
        return (
            <RoundedCard
                className="h-[50px] border-t border-slate-600 bg-slate-100 dark:bg-slate-700/30 mb-1 rounded-none animate-pulse border-none"
            />
        )
    }

    if (!show || !info) return;

    const { athstat_firstname } = info;

    const playerInitial = athstat_firstname && athstat_firstname.length >= 1 ?
        `${athstat_firstname[0]}.` : "";

    const isEvenRow = ((index) % 2) === 0;

    return (
        <div className={twMerge(
            'w-full min-w-fit flex flex-row flex-nowrap items-center justify-start border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors',
            !isEvenRow && "bg-white dark:bg-[#1E293B]",
            isEvenRow && "bg-slate-100 dark:bg-[#27354d]",
            className
        )}>
            {/* Player Name Column - Sticky */}
            <div className={twMerge(
                "flex sticky left-0 z-10 w-[180px] min-w-[180px] px-3 py-3 flex-row border-r border-slate-200 dark:border-slate-700/40 items-center gap-2",
                !isEvenRow && "bg-white dark:bg-[#1E293B]",
                isEvenRow && "bg-slate-100 dark:bg-[#27354d]",
            )}>
                <p className="text-sm font-medium truncate">
                    {playerInitial} {info?.athstat_lastname}
                </p>
            </div>

            {/* Stats Columns */}
            {record.stats.map((stat, statIndex) => {
                return (
                    <div
                        key={statIndex}
                        className={twMerge(
                            "flex-1 min-w-[60px] flex flex-row items-center justify-center px-3 py-3",
                        )}
                    >
                        <SecondaryText className="font-medium text-sm">{stat}</SecondaryText>
                    </div>
                )
            })}
        </div>
    )
}
