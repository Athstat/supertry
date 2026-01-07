import { twMerge } from "tailwind-merge"

type Props = {
    value?: number | string,
    className?: string
}

export default function RankNumberCard({value, className} : Props) {
    return (
        <div className={twMerge(
            "flex-shrink-0 w-8 h-8 bg-[#DDE5ED] dark:bg-gray-700 rounded-md flex items-center justify-center",
            className
        )}>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    )
}
