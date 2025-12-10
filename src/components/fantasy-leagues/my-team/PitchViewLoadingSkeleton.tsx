import { twMerge } from "tailwind-merge";
import RoundedCard from "../../shared/RoundedCard";
import { RugbyPitch3DRaster } from "../../shared/RugbyPitch";
import BottomSheetView from "../../ui/BottomSheetView";


/** Renders a pitch view loading skeleton */
export default function PitchViewLoadingSkeleton() {
    return (
        <div>
            <div className="flex px-4 animate-pulse flex-row items-center justify-between"  >
                <div className="flex flex-col gap-1" >
                    <RoundedCard className="w-[70px] border-none h-[15px]" />
                    <RoundedCard className="w-[50px] border-none h-[15px]" />
                </div>

                <div className="flex flex-col gap-2 items-center justify-center" >
                    <RoundedCard className="w-[70px] border-none h-[20px]" />
                    <RoundedCard className="w-[100px] border-none h-[15px]" />
                </div>

                <div className="flex animate-pulse flex-col gap-1 items-end justify-end" >
                    <RoundedCard className="w-[70px] border-none h-[15px]" />
                    <RoundedCard className="w-[50px] border-none h-[15px]" />
                </div>
            </div>

            <div className="h-[30px] my-4 flex flex-col items-center justify-center" >
                <RoundedCard className="w-1/2 border-none h-[30px] animate-pulse" >

                </RoundedCard>
            </div>

            <div className="mt-4 ">
                <div className='flex flex-col relative'>


                    <div className="relative w-full flex flex-col justify-center">
                        
                        <RugbyPitch3DRaster pitchClassName="opacity-50" />

                        <div className='top-0 left-0 absolute w-full p-4 flex flex-col gap-6' >

                            <div className='flex flex-row items-center gap-2 justify-center' >
                                <PitchCardSkeleton />
                                <PitchCardSkeleton />
                            </div>

                            <div className='flex flex-row items-center gap-2 justify-center' >
                                <PitchCardSkeleton />
                                <PitchCardSkeleton />
                                <PitchCardSkeleton />
                            </div>


                        </div>
                    </div>

                    {/* Super Substitute */}
                    <BottomSheetView className="mmin-h-[150px] min-h-[130px]" >

                    </BottomSheetView>

                </div>
            </div>
        </div>
    )
}


function PitchCardSkeleton() {

    return (
        <div className="flex animate-pulse flex-col items-center justify-center gap-1 relative">
            <div
                className={twMerge(
                    'overflow-hidden cursor-pointer rounded-xl min-h-[150px] max-h-[150px] bg-gradient-to-br from-green-500/30 to-green-500/60',
                    'min-w-[120px] max-w-[120px] flex flex-col'
                )}
            >
                <div className="flex-1 h-full flex overflow-clip flex-col items-center justify-center w-full gap-2">

                </div>
            </div>
        </div>
    );
}
