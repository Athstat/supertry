import WarningCard from "../../shared/WarningCard";
import { ArrowLeftRight, Sparkles, X } from "lucide-react";
import { useSticky } from "../../../hooks/useSticky";
import { Sticky } from "../../shared/Sticky";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useAtomValue } from "jotai";
import { comparePlayersAtomGroup } from "../../../state/comparePlayers.atoms";
import { usePlayerCompareActions } from "../../../hooks/usePlayerCompare";

type Props = {
}

export default function PlayersScreenCompareStatus({ }: Props) {

    const isPicking = useAtomValue(
        comparePlayersAtomGroup.isCompareModePicking
    )

    const selectedPlayers = useAtomValue(
        comparePlayersAtomGroup.comparePlayersAtom
    );

    const { removePlayer, stopPicking, showCompareModal } = usePlayerCompareActions();
    const { sentinelRef, isSticky } = useSticky<HTMLDivElement>();

    return (
        <div>

            <div ref={sentinelRef} />

            {isPicking && (

                <WarningCard className="p-3 flex overflow-y-auto flex-col gap-4" >

                    <div className="flex flex-row gap-2 items-center w-full" >
                        <div className="flex flex-row items-center gap-2" >
                            <Sparkles className="w-6 h-6" />
                            <p className="text-sm w-fit" >You are now in compare mode. In order to select players you want to compare, simply click on their card</p>
                        </div>

                        <button onClick={stopPicking} >
                            <X className="w-4 h-4" />
                        </button>

                    </div>

                    <div className="flex flex-row  items-center w-full gap-2 flex-wrap" >

                        {selectedPlayers.map((p) => {
                            return (
                                <div
                                    key={p.tracking_id}
                                    onClick={() => removePlayer(p)}
                                    className="px-3 py-1 text-[10px] bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                                >
                                    {p.player_name}
                                    <X className="w-3 h-3" />

                                </div>
                            )
                        })}

                    </div>

                    <PrimaryButton
                        className=" lg:w-[50%] text-xs flex flex-row items-center gap-1"
                        onClick={showCompareModal}
                    >
                        Compare Players
                        <ArrowLeftRight className="w-4 h-4" />
                    </PrimaryButton>

                </WarningCard>
            )}


            {isSticky && isPicking && (
                <Sticky className="" >
                    <div className="z-10 bottom-20 fixed py-2  flex flex-col gap-1 w-full items-center justify-center left-0" >

                        <div className="flex flex-col bg-slate-200 gap-2 flex-wrap px-4 py-4 dark:bg-slate-800/95 rounded-xl w-[90%] lg:w-[50%]" >

                            <div className="flex flex-row items-center justify-between" >

                                <p className="truncate" >Click to Select Player</p>

                                <button className="p-2 rounded-md hover:bg-slate-200 hover:dark:bg-slate-700" onClick={stopPicking} >
                                    <X className="w-4 h-4" />
                                </button>

                            </div>

                            <div className="flex flex-col" >

                                <div className="flex flex-row items-center max-h-24 overflow-x-auto flex-wrap gap-1" >
                                    {selectedPlayers.map((p) => {
                                        return (
                                            <div
                                                key={p.tracking_id}
                                                onClick={() => removePlayer(p)}
                                                className="px-3 py-1 text-xs bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                                            >
                                                {p.player_name}
                                                <X className="w-3 h-3" />

                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {isPicking && (

                            <PrimaryButton
                                className="w-[90%] lg:w-[50%] flex flex-row items-center gap-1"
                                onClick={showCompareModal}
                            >
                                Compare Players
                                <ArrowLeftRight className="w-4 h-4" />
                            </PrimaryButton>

                        )}
                    </div>
                </Sticky>
            )}
        </div>
    )
}
