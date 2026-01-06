import { XIcon } from "lucide-react";

type Props = {
    onClearFilter: () => void;
}

export default function ClearFixturesCalendarFilterButton({ onClearFilter }: Props) {
    return (
        <button
            onClick={onClearFilter}
            className="flex bg-slate-200 dark:bg-slate-800 border-slate-300 px-2 py-1 rounded-xl border dark:border-slate-700/40 flex-row text-sm items-center justify-center gap-2"
        >
            <p>Clear Filter</p>
            <XIcon className="w-4 h-4" />
        </button>
    )
}
