import { twMerge } from "tailwind-merge"

type Props = {
    value?: number | string,
    className?: string
}

export default function RankNumberCard({ value, className }: Props) {

    const charLen = `${value ?? ""}`.length;
    const textSize = charLen <= 3 ? "12px" : charLen <= 5 ? "11px" : "10px";

    return (
        <div className={twMerge(
            "flex-shrink-0 w-8 h-8 bg-[#DDE5ED] dark:bg-gray-700 rounded-full flex flex-row items-center justify-center",
            className
        )}>
            <p
                className="font-semibold text-wrap truncate"
                style={{
                    fontSize: textSize
                }}
            >{value}</p>
        </div>
    )
}
