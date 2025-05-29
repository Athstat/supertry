import { Sparkles } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
    onClick?: () => void,
    className?: string
}

export default function PlayersCompareButton({ className, onClick }: Props) {

    return (
        <button
            onClick={onClick}
            className={twMerge(
                "flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800/40 hover:bg-gray-200 dark:hover:bg-dark-800 rounded-lg text-gray-600 dark:text-gray-300 font-medium",
                className
            )}
        >
            <Sparkles className="w-4 h-4" />
            <p>Compare</p>
        </button>
    )
}
