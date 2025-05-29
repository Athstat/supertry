import { useContext } from "react"
import { PlayersScreenContext } from "../../../contexts/PlayersScreenContext"
import WarningCard from "../../shared/WarningCard";
import { Sparkles } from "lucide-react";

export default function PlayerCompareStatus() {

    const context = useContext(PlayersScreenContext);

    if (!context) return;

    const {isComparing} = context;

    return (
        <div>
            {isComparing && (
                <WarningCard className="p-3" >
                    <div className="flex flex-row gap-2" >
                        <Sparkles className="w-10 h-10" />
                        <p className="text-sm" >You are now in compare mode. In order to select players you want to compare, simply click on their card</p>
                    </div>
                </WarningCard>
            )}
        </div>
    )
}
