import { twMerge } from "tailwind-merge"
import { useQueryState } from "../../../hooks/useQueryState"

export type PillBarItems = {
    label?: string,
    icon?: any,
    key?: string
}

type Props = {
    items?: PillBarItems[],
    searchParam?: string
}

/** Renders a bar of tab pills, usually used for filtering */
export default function PillBar({ items = [], searchParam }: Props) {

    const [curr, setCurr] = useQueryState(searchParam ?? "q");

    const onClickPill = (pillKey?: string) => {
        if (searchParam && pillKey) {
            setCurr(pillKey);
        }
    }

    return (
        <div className="flex flex-row overflow-y-auto items-center gap-2" >
            {items.map((i, index) => {
                return (
                    <button
                        key={index}
                        onClick={() => onClickPill(i.key)}
                        className={twMerge(
                            "bg-slate-100 border text-xs lg:text-base border-slate-200 rounded-full px-3 py-0.5 text-slate-700",
                            "dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-500 dark:hover:bg-slate-700/80",
                            "cursor-pointer hover:bg-slate-200",
                            curr === i.key && "bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white dark:text-white dark:border-blue-500 border-blue-400"
                        )}
                    >
                        {i.label}
                    </button>
                )
            })}
        </div>
    )
}