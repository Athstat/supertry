import { useContext } from "react"
import { PlayersScreenContext } from "../../../contexts/PlayersScreenContext"
import WarningCard from "../../shared/WarningCard";
import { Sparkles, X } from "lucide-react";
import { useSticky } from "../../../hooks/useSticky";
import { Sticky } from "../../shared/Sticky";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { IProAthlete } from "../../../types/athletes";

type Props = {
    onRemovePlayer: (player: IProAthlete) => void,
    selectedPlayers: IProAthlete[]
    onStopPickingPlayers?: () => void,
    isPicking?: boolean,
    setIsPicking?: (flag: boolean) => void
}

export default function PlayerCompareStatus({ onRemovePlayer, onStopPickingPlayers, selectedPlayers, isPicking, setIsPicking }: Props) {

    const context = useContext(PlayersScreenContext);

    if (!context) return;

    const { sentinelRef, isSticky } = useSticky<HTMLDivElement>();

    const startPicking = () => {

        if (!isPicking && setIsPicking) {
            setIsPicking(true);
        }
    }

    return (
        <div>

            <div ref={sentinelRef} />

            {isPicking && (

                <WarningCard className="p-3 flex flex-col gap-2" >

                    <div className="flex flex-row gap-2 items-center w-full" >
                        <Sparkles className="w-6 h-6" />
                        <p className="text-sm w-fit" >You are now in compare mode. In order to select players you want to compare, simply click on their card</p>
                    </div>

                    <div className="flex flex-row items-center w-full gap-2 flex-wrap" >

                        {selectedPlayers.map((p) => {
                            return (
                                <div
                                    key={p.tracking_id}
                                    onClick={() => onRemovePlayer(p)}
                                    className="px-3 py-1 text-xs bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                                >
                                    {p.player_name}
                                    <X className="w-4 h-4" />

                                </div>
                            )
                        })}

                    </div>

                </WarningCard>
            )}


            {isSticky && isPicking && (
                <Sticky className="" >
                    <div className="z-10 bottom-20 fixed py-2  flex flex-col gap-1 w-full items-center justify-center left-0" >

                        <div className="flex bg-slate-200 gap-2 flex-row flex-wrap px-4 py-4 dark:bg-slate-800/95 rounded-xl w-[90%] lg:w-[50%]" >

                            <p>Click on a player's card to select them for comparison</p>
                            {selectedPlayers.map((p) => {
                                return (
                                    <div
                                        key={p.tracking_id}
                                        onClick={() => onRemovePlayer(p)}
                                        className="px-3 py-1 text-xs bg-yellow-700 hover:bg-yellow-600 cursor-pointer text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                                    >
                                        {p.player_name}
                                        <X className="w-3 h-3" />

                                    </div>
                                )
                            })}
                        </div>

                        {isPicking && (

                            <PrimaryButton className="w-[90%] lg:w-[50%]" onClick={onStopPickingPlayers} >
                                Compare Players
                            </PrimaryButton>

                        )}
                    </div>
                </Sticky>
            )}
        </div>
    )
}
