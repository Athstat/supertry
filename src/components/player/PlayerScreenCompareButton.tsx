import { Sparkles } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { useSticky } from "../../hooks/useSticky"
import PrimaryButton from "../ui/buttons/PrimaryButton"
import { Sticky } from "../ui/containers/Sticky"
import { usePlayerCompareActions } from "../../hooks/usePlayerCompare"
import { useAtomValue } from "jotai"
import { comparePlayersAtomGroup } from "../../state/comparePlayers.atoms"

type Props = {
    className?: string
}

export default function PlayersCompareButton({ className }: Props) {

    const { sentinelRef, isSticky } = useSticky<HTMLDivElement>();

    const isPicking = useAtomValue(
        comparePlayersAtomGroup.isCompareModePicking
    );

    // Hide sticky compare button if modal is open
    const isCompareModalOpen = useAtomValue(
        comparePlayersAtomGroup.isCompareModeModal
    );


    const {startPicking, stopPicking} = usePlayerCompareActions();

    const handleOnClick = () => {
        if (!isPicking) {
            startPicking()
        } else {
            stopPicking()
        }
    }

    return (
        <div>
            <div ref={sentinelRef} />
            <button
                onClick={startPicking}
                className={twMerge(
                    "flex items-center dark:text-white text-slate-700 gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800/40 hover:bg-gray-200 dark:hover:bg-dark-800 rounded-lg font-medium",
                    isPicking && "text-white",
                    className
                )}
            >
                <Sparkles className="w-4 h-4" />
                <p>Compare</p>
            </button>

            {isSticky && !isPicking && !isCompareModalOpen && (
                <Sticky className="" >
                    <div className="z-[1000] bottom-20 fixed px-4 py-2  flex flex-col items-center justify-center gap-1 w-full  left-0" >

                        <PrimaryButton
                            onClick={handleOnClick}
                            className="animate-glow  flex flex-row items-center from-primary-500 to-blue-700 bg-gradient-to-r gap-1 w-[90%] lg:w-[40%]"
                        >
                            <Sparkles className="w-4 h-4 " />
                            Compare
                        </PrimaryButton>

                    </div>
                </Sticky>
            )}
        </div>
    )
}
