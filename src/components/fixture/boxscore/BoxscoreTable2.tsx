import { BoxscoreHeader, BoxscoreListRecordItem } from "../../../types/boxScore"
import BoxscoreTableProvider, { useBoxscoreTable } from "./BoxscoreTableProvider"
import { useMemo } from "react"
import { useTableSort } from "../../../hooks/tables/useTableSort"
import { BoxscoreTableColumn } from "./BoxscoreTableColumn"
import { BoxscoreTableRecord } from "./BoxscoreTableRecord"
import { logger } from "../../../services/logger"

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
    const { sortIndex, sortDirection } = useTableSort();

    const sortedRows = useMemo(() => {
        return records.sort((a, b) => {

            try {
                const aIndexStat = Number(a.stats[sortIndex].toString().replace("%", ""));
                const bIndexStat = Number(b.stats[sortIndex].toString().replace("%", ""));

                if (sortDirection === "desc") {
                    return bIndexStat - aIndexStat;
                }

                return aIndexStat - bIndexStat;
            } catch (err) {
                logger.error("Error sorting rows ", err);
            }  

            return 0;
        });
    }, [records, sortDirection, sortIndex]);

    return (
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
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
            <div className="w-full flex flex-col overflow-x-auto bg-white dark:bg-[#111418]">
                {/* Table Header */}
                <div className="h-[44px] w-full min-w-fit flex flex-row items-center border-b border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#1a1e24]">
                    {firstColumn && (
                        <BoxscoreTableColumn
                            column={firstColumn}
                            className="w-[180px] bg-white dark:bg-[#1a1e24]   min-w-[180px] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-700/40"
                        />
                    )}

                    {secondaryColumns.map((column, index) => {
                        return (
                            <BoxscoreTableColumn
                                key={column.key || index}
                                column={column}
                                className="flex-1  justify-center"
                                sortIndex={index}
                            />
                        )
                    })}
                </div>

                {/* Table Body */}
                <div className="flex w-full min-w-fit flex-col">
                    {sortedRows.map((record, index) => {
                        return (
                            <BoxscoreTableRecord
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