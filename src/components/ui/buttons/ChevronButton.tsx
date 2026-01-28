import { ChevronLeft, ChevronRight } from "lucide-react"

type ChevronButtonProps = {
    onClick?: () => void,
    direction?: "left" | "right",
    disabled?: boolean
}

export function ChevronButton({ onClick, direction = "left", disabled = false }: ChevronButtonProps) {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#DAEAF7] dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_3px_rgba(0,0,0,0.30)]"
        >
            {/* <span className="text-sm hidden sm:inline">Next</span> */}
            {direction === "left" && <ChevronLeft className="h-7 w-7 text-[#1196F5]" />}
            {direction === "right" && <ChevronRight className="h-7 w-7 text-[#1196F5]" />}
        </button>
    )

}