import { ChevronLeft, ChevronRight } from "lucide-react"


type Props = {
    onClick?: () => void,
    direction?: "left" | "right"
}

/** Renders a chevron button */
export default function ChevronButton({ onClick, direction = "left" }: Props) {
    return (
        <button
            onClick={onClick}
            className="text-[#1196F5] bg-[#e0e9ef] dark:bg-slate-700/70 rounded-md"
        >
            {direction === "left" && (
                <ChevronLeft className="w-10 h-10" />
            )}

            {direction === "right" && (
                <ChevronRight className="w-10 h-10" />
            )}
        </button>
    )
}
