import { twMerge } from "tailwind-merge";
import RoundedCard from "../ui/cards/RoundedCard";
import { RugbyPitch3DRaster } from "../ui/containers/RugbyPitch";
import BottomSheetView from "../ui/modals/BottomSheetView";

type Props = {
    className?: string,
    hideHistoryBar?: boolean
}

/** Renders a pitch view loading skeleton */
export default function PitchViewLoadingSkeleton({ className, hideHistoryBar = false }: Props) {
    return (
        <div className="flex flex-col gap-4" >

            {!hideHistoryBar && <div className={twMerge(
                "flex px-4 animate-pulse w-full flex-row items-center justify-center gap-2",
                className
            )}  >
                <RoundedCard className="border-none rounded-full w-[30px] h-[30px] " />
                <RoundedCard className="border-none w-[100px] h-[30px] " />
                <RoundedCard className="border-none rounded-full w-[30px] h-[30px] " />
            </div>}

            <div className="flex flex-col items-center gap-2">

                <div className="w-full px-4" >
                    <RoundedCard className="border-none w-full h-[100px] mb-10 " />
                </div>

                <RugbyPitch3DRaster className='bg-blend-color-burn mt-[20] opacity-55 dark:opacity-20' />
                <BottomSheetView noAnimation className='' hideHandle />
            </div>

        </div>
    )
}


// function PitchCardSkeleton() {

//     return (
//         <div className="flex animate-pulse flex-col items-center justify-center gap-1 relative">
//             <div
//                 className={twMerge(
//                     'overflow-hidden cursor-pointer rounded-xl min-h-[150px] max-h-[150px] bg-gradient-to-br from-green-500/30 to-green-500/60',
//                     'min-w-[120px] max-w-[120px] flex flex-col'
//                 )}
//             >
//                 <div className="flex-1 h-full flex overflow-clip flex-col items-center justify-center w-full gap-2">

//                 </div>
//             </div>
//         </div>
//     );
// }
