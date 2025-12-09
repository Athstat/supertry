import { Binoculars } from "lucide-react";
import PageView from "../PageView";
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList";
import RoundedCard from "../../components/shared/RoundedCard";
import { ScoutingListPlayerCard } from "../../components/scouting/ScoutingListPlayerCard";
import { useState } from "react";
import { IProAthlete } from "../../types/athletes";
import PlayerProfileModal from "../../components/player/PlayerProfileModal";

/** Renders scouting list screen */
export default function ScoutingListScreen() {

    const { list, loadingList } = useScoutingList();
    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();

    const handleClickPlayer = (player: IProAthlete) => {
        setSelectedPlayer(player);
    }

    const handleCloseProfileModal = () => {
        setSelectedPlayer(undefined);
    }

    if (loadingList) {
        return (
            <PageView className="px-6 flex flex-col gap-4" >
                <div className="flex flex-row items-center gap-2" >
                    <Binoculars />
                    <p className="text-lg font-bold" >My Scouting List</p>
                </div>

                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
                <RoundedCard className="w-full min-h-[100px] animate-pulse border-none" />
            </PageView>
        )
    }

    return (
        <PageView className="px-6 flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2" >
                <Binoculars />
                <p className="text-lg font-bold" >My Scouting List</p>
            </div>

            <div className="flex flex-col gap-2" >
                {list.map((si) => {
                    return <ScoutingListPlayerCard
                        item={si}
                        key={si.athlete.tracking_id}
                        onClick={handleClickPlayer}
                    />
                })}
            </div>

            {selectedPlayer && <PlayerProfileModal 
                player={selectedPlayer}
                isOpen={Boolean(selectedPlayer)}
                onClose={handleCloseProfileModal}
            />}
        </PageView>
    )
}

