import { ReactNode } from "react"
import BottomSheetHandle from "./BottomSheetHandle"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

/** Renders a bottom sheet view that starts from the bottom of the screen */
export default function BottomSheetView({ className, children }: Props) {
    return (
        <div className="fixed bottom-0 left-0 w-full  flex flex-col items-center justify-center" >
            <div className={twMerge(
                "lg:max-w-[40%] flex flex-col gap-2 md:max-w-[50%] max-h-[130px] min-h-[130px]  w-full bg-white dark:bg-[#0D0D0D] rounded-t-3xl drop-shadow-2xl shadow-[0_-8px_20px_rgba(0,0,0,0.3)]",
                className
            )}>

                <div className="flex flex-row items-center justify-center w-full" >
                    <BottomSheetHandle />
                </div>
                {children}
            </div>
        </div>
    )
}
