import { useContext } from "react"
import { PlayersScreenContext } from "../../../contexts/PlayersScreenContext"
import WarningCard from "../../shared/WarningCard";
import { Sparkles, X } from "lucide-react";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { AnimatePresence } from "framer-motion";

type Props = {
    onRemovePlayer: (player: RugbyPlayer) => void
}

export default function PlayerCompareStatus({onRemovePlayer} : Props) {

    const context = useContext(PlayersScreenContext);

    if (!context) return;

    const { isComparing, selectedPlayers } = context;

    return (
        <AnimatePresence>
            {isComparing && (
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
                                    className="px-3 py-1 text-xs bg-yellow-700 text-yellow-400 rounded-xl flex flex-row items-center gap-0.5"
                                >
                                    {p.player_name}
                                    <X className="w-4 h-4" />

                                </div>
                            )
                        })}

                    </div>

                </WarningCard>
            )}
        </AnimatePresence>
    )
}
