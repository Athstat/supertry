import { useMemo } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    value?: number | string,
    className?: string
}

export default function RankNumberCard({ value, className }: Props) {

    const textSize = useMemo(() => {

        const charLen = value ? `${value}`.length : 0;

        if (charLen <= 3) {
            return '12px'
        }

        if (charLen >= 4 && charLen <= 5) {
            return '11px';
        }

        if (charLen >= 6) {
            return '10px';
        }

    }, [value])

    return (
        <div className={twMerge(
            "flex-shrink-0 w-8 h-8 bg-[#DDE5ED] dark:bg-gray-700 rounded-md flex flex-row items-center justify-center",
            className
        )}>
            <p 
                className="font-semibold text-wrap truncate max-w-8"
                style={{
                    fontSize: textSize
                }}
            >{value}</p>
        </div>
    )
}
