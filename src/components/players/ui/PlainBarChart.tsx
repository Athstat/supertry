import { twMerge } from "tailwind-merge"
import SecondaryText from "../../shared/SecondaryText"

export type BarChartRecord = {
    displayVal?: string,
    value: number,
    secondaryVal?: string,
    className?: string,
    date?: Date
}

type BarChartProps = {
    records: BarChartRecord[],
    maxValue: number,
    scaleFactor: number,
    pivotValue?: number
}

export function PlainBarChart({ records, maxValue, scaleFactor = 1 }: BarChartProps) {
    return (
        <div
            className={twMerge(
                "dark:bg-dark-850/50 p-4 rounded-xl"
            )}
        >

            <div
                style={{ height: maxValue * scaleFactor }}
                className="flex relative flex-row items-end gap-2"
            >
                {records.map((r) => {
                    return (
                        <div
                            style={{ height: r.value * scaleFactor }}
                            className="flex-1 flex flex-col items-center gap-1"
                        >
                            <SecondaryText className="text-xs" >{r.displayVal}</SecondaryText>

                            <div
                                className={twMerge(
                                    "w-full h-full bg-blue-500",
                                    r.className
                                )}
                            >

                            </div>

                        </div>
                    )
                })}

                <div
                    className="abolute" 
                >
                </div>
            </div>

        </div>
    )
}