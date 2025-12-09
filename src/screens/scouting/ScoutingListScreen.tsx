import { ArrowLeft, Binoculars } from "lucide-react";
import PageView from "../PageView";
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList";
import RoundedCard from "../../components/shared/RoundedCard";
import { ScoutingListPlayerCard } from "../../components/scouting/ScoutingListPlayerCard";
import { useState } from "react";
import PlayerProfileModal from "../../components/player/PlayerProfileModal";
import ScoutingListPlayerModal from "../../components/scouting/ScoutingListPlayerModal";
import { ScoutingListPlayer } from "../../types/fantasy/scouting";
import CircleButton from "../../components/shared/buttons/BackButton";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";

/** Renders scouting list screen */
export default function ScoutingListScreen() {

    const { list, loadingList } = useScoutingList();
    const { hardPop } = useNavigateBack()

    const [selectedPlayer, setSelectedPlayer] = useState<ScoutingListPlayer>();
    const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
    const [showScoutingModal, setShowScoutingModal] = useState<boolean>(false);

    const handleClickPlayer = (player: ScoutingListPlayer) => {
        setSelectedPlayer(player);
        setShowScoutingModal(true);
        setShowProfileModal(false);
    }

    const handelViewProfile = (player: ScoutingListPlayer) => {
        setSelectedPlayer(player);
        setShowProfileModal(true);
    }

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    }

    const handleCloseScoutingModal = () => {
        setSelectedPlayer(undefined);
        setShowProfileModal(false);
        setShowScoutingModal(false);
    }

    const handleNavigateBack = () => {
        hardPop('/players');
    }

    if (loadingList) {
        return (
            <PageView className="px-6 flex flex-col gap-4" >
                <div className="flex flex-row items-center gap-2" >
                    
                    <CircleButton
                        onClick={handleNavigateBack}
                    >
                        <ArrowLeft />
                    </CircleButton>

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
        <PageView className="p-4 flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2" >

                <CircleButton
                    onClick={handleNavigateBack}
                >
                    <ArrowLeft />
                </CircleButton>

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

            {selectedPlayer && <ScoutingListPlayerModal
                item={selectedPlayer}
                isOpen={showScoutingModal}
                onClose={handleCloseScoutingModal}
                onViewProfile={handelViewProfile}
            />}

            {selectedPlayer && <PlayerProfileModal
                player={selectedPlayer.athlete}
                isOpen={showProfileModal}
                onClose={handleCloseProfileModal}
            />}
        </PageView>
    )
}


function NoContentScreen() {
    return (
        <div></div>
    )
}