import { Sparkles } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { useSticky } from "../../hooks/useSticky"
import PrimaryButton from "../shared/buttons/PrimaryButton"
import { Sticky } from "../shared/Sticky"
import { useContext } from "react"
import { PlayersScreenContext } from "../../contexts/PlayersScreenContext"

type Props = {
    onClick?: () => void,
    className?: string
}

export default function PlayersCompareButton({ className, onClick }: Props) {

    const { sentinelRef, isSticky } = useSticky<HTMLDivElement>();
    const context = useContext(PlayersScreenContext);
    const isComparing = context?.isComparing;

    return (
        <div>
            <div ref={sentinelRef} />
            <button
                onClick={onClick}
                className={twMerge(
                    "flex items-center text-white gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800/40 hover:bg-gray-200 dark:hover:bg-dark-800 rounded-lg font-medium",
                    className
                )}
            >
                <Sparkles className="w-4 h-4" />
                <p>Compare</p>
            </button>

            {isSticky && !isComparing && (
                <Sticky className="" >
                    <div className="z-10 bottom-20 fixed px-4 py-2  flex flex-col items-center justify-center gap-1 w-full  left-0" >

                        <PrimaryButton
                            onClick={onClick}
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
