import { twMerge } from "tailwind-merge"
import { BoxscoreHeader, BoxscoreListRecordItem } from "../../../types/boxScore"
import BoxscoreTableProvider, { useBoxscoreTable } from "./BoxscoreTableProvider"
import SecondaryText from "../../shared/SecondaryText"

type Props = {
    title?: string,
    columns: BoxscoreHeader[],
    records: BoxscoreListRecordItem[],
    noContentMessage?: string
}

/** Renders an ESPN like boxscore Table */
export default function BoxscoreTable2({title, columns, records, noContentMessage} : Props) {
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
    
    const {title, firstColumn, secondaryColumns} = useBoxscoreTable();
    
    return (
        <div
            className="w-full rounded-2xl overflow-clip bg-slate-100 dark:bg-slate-800/60"
        >
            <div
                className="p-4 "
            >
                <p>{title}</p>
            </div>

            <div className="h-full flex flex-row items-center border-b-2 border-slate-200 dark:border-slate-700 border-t-2 " >
                {firstColumn && (
                    <TableColumn 
                        index={0}
                        column={firstColumn}
                        className="w-[150px] border-r-2 border-slate-100 dark:border-slate-700"
                    />
                )}

                {secondaryColumns.map((column, index) => {
                    return (
                        <TableColumn 
                            column={column}
                            index={index + 1}
                            className="flex-1"
                        />
                    )
                })}
            </div>
        </div>
    )
}


type TableColumnProps = {
    column: BoxscoreHeader,
    index: number,
    className?: string
}
function TableColumn({column, index, className} : TableColumnProps) {


    return (
        <div key={column.key || index} 
            className={twMerge(
                'px-2 py-1',
                className
            )}
        >
            <SecondaryText className="font-semibold text-sm " >{column.lable}</SecondaryText>
        </div>
    )
}