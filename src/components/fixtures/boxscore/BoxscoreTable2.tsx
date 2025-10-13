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
        <div
            className="w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800/60 border-2 dark:border-slate-800"
        >
            <div
                className="p-4 "
            >
                <p>{title}</p>
            </div>

            <div className="w-ful flex flex-col overflow-x-scroll" >
                <div className="h-[40px] w-[100vh] overflow-visable flex flex-row items-center border-b-2 border-slate-200 dark:border-slate-700 border-t-2 " >
                    
                    {firstColumn && (
                        <TableColumn
                            index={0}
                            column={firstColumn}
                            className="min-w-[200px] bg-white dark:bg-slate-800 sticky left-0 border-r-2 border-slate-100 dark:border-slate-700"
                        />
                    )}

                    {secondaryColumns.map((column, index) => {
                        return (
                            <TableColumn
                                column={column}
                                index={index + 1}
                                className="min-w-[80px] bg-white dark:bg-slate-800"
                            />
                        )
                    })}
                </div>

                <div className="flex w-[100vh] flex-nowrap flex-col divide-y-2 dark:divide-slate-700/30 divide-slate-1" >
                    {records.map((record, index) => {
                        return (
                            <TableRecord
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
    index: number,
    className?: string
}
function TableColumn({ column, index, className }: TableColumnProps) {


    return (
        <div key={column.key || index}
            className={twMerge(
                'px-2 py-1 h-full flex flex-row items-center justify-start',
                className
            )}
        >
            <SecondaryText className="font-semibold text-sm " >{column.lable}</SecondaryText>
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

    const isEventhItem = ((index) % 2) === 0;

    return (
        <div className={twMerge(
            'min-w-full flex flex-row flex-nowrap min-h-full items-center justify-start',
            isEventhItem && "bg-slate-100 dark:bg-slate-800",
            !isEventhItem && "bg-white dark:bg-[#152134]",
            className
        )} >
            <div className={twMerge(
                "flex sticky left-0 min-w-[200px]  px-2 py-2 flex-row border-r  items-center gap-1 dark:border-slate-600 border-slate-200 ",
                isEventhItem && "bg-slate-100 dark:bg-slate-800",
                !isEventhItem && "bg-white dark:bg-[#152134]",
            )} >
                <p>{playerInitial} {info?.athstat_lastname}</p>
            </div>

            {record.stats.map((stat) => {
                return (
                    <div
                        className="min-w-[80px] flex flex-row items-center justify-start px-2"
                    >
                        <SecondaryText className="font-semibold" >{stat}</SecondaryText>
                    </div>
                )
            })}
        </div>
    )
}