import { twMerge } from "tailwind-merge"
import SecondaryText from "../../shared/SecondaryText"

export type BarChartRecord = {
    displayVal?: string,
    value: number,
    secondaryVal?: string,
    className?: string,
    date?: Date,
    imageUrl?: string
}

type BarChartProps = {
    records: BarChartRecord[],
    maxValue: number,
    scaleFactor: number,
    pivotValue?: number,
    xLabel?: string
}

export function PlainBarChart({ records, maxValue, scaleFactor = 1, xLabel }: BarChartProps) {
    return (
        <div
            className={twMerge(
                "dark:bg-dark-850/50 pt-4 px-4 rounded-xl"
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

                            {r.imageUrl && <div>
                                <img 
                                    src={r.imageUrl}
                                    className="w-6 h-6"
                                />
                            </div>}

                        </div>
                    )
                })}

                <div
                    className="abolute" 
                >
                </div>
            </div>

            <div className="py-2 w-full items-center justify-center flex flex-row" >
                <SecondaryText className="text-xs" >{xLabel}</SecondaryText>
            </div>

        </div>
    )
}