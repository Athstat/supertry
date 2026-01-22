import { ArrowLeft, Binoculars, Plus } from "lucide-react";
import PageView from "../../../components/ui/containers/PageView";
import { useScoutingList } from "../../../hooks/fantasy/scouting/useScoutingList";
import RoundedCard from "../../../components/ui/cards/RoundedCard";
import { useMemo, useState } from "react";
import PlayerProfileModal from "../../../components/player/PlayerProfileModal";
import { ScoutingListPlayer } from "../../../types/fantasy/scouting";
import CircleButton from "../../../components/ui/buttons/BackButton";
import { useNavigateBack } from "../../../hooks/web/useNavigateBack";
import SecondaryText from "../../../components/ui/typography/SecondaryText";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes";
import { IProAthlete } from "../../../types/athletes";
import SmartPlayerMugshot from "../../../components/player/SmartPlayerMugshot";
import { formatPosition } from "../../../utils/athletes/athleteUtils";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import { useHideTopNavBar } from "../../../hooks/navigation/useNavigationBars";
import { ScoutingListPlayerCard } from "../../../components/players/scouting/ScoutingListPlayerCard";
import ScoutingListPlayerModal from "../../../components/players/scouting/ScoutingListPlayerModal";
import { usePlayerSeasonTeam } from "../../../hooks/seasons/useSeasonTeams";
import SearchBar from "../../../components/player_picker/SearchBar";
import { useDebounced } from "../../../hooks/web/useDebounced";
import { AthleteFilterBuilder } from "../../../utils/athletes/athlete_filter";

/** Renders scouting list screen */
export default function ScoutingListScreen() {

    useHideTopNavBar();
    const { list, loadingList, mutateList } = useScoutingList();
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

    const handlePostRemove = async () => {
        await mutateList();
        setSelectedPlayer(undefined);
        setShowScoutingModal(false);
        setShowProfileModal(false);
    }

    const listHasPlayers = list.length > 0;

    if (loadingList) {
        return (
            <PageView className="px-4 flex flex-col gap-4 py-4" >
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

            <div>
                <SecondaryText>
                    You can only scout up to 5 players at time, per each competition
                </SecondaryText>
            </div>

            {listHasPlayers && <div className="flex flex-col gap-2 mb-6" >
                {list.map((si) => {
                    return <ScoutingListPlayerCard
                        item={si}
                        key={si.athlete.tracking_id}
                        onClick={handleClickPlayer}
                    />
                })}
            </div>}

            {!listHasPlayers && <NoContent />}

            {selectedPlayer && showScoutingModal && <ScoutingListPlayerModal
                item={selectedPlayer}
                isOpen={showScoutingModal}
                onClose={handleCloseScoutingModal}
                onViewProfile={handelViewProfile}
                onRemove={handlePostRemove}
            />}

            {selectedPlayer && showProfileModal && <PlayerProfileModal
                player={selectedPlayer.athlete}
                isOpen={showProfileModal}
                onClose={handleCloseProfileModal}
            />}

            {<SuggestedPlayers />}
        </PageView>
    )
}


function NoContent() {
    return (
        <div className="flex flex-col items-center justify-center h-[200px]" >
            <SecondaryText className="text-center" >Your scouting list is empty.<br/>Add players to your scouting list to get started!</SecondaryText>
        </div>
    )
}

function SuggestedPlayers() {

    const [searchQuery, setSearchQuery] = useState<string>();
    const debouncedSearchQuery = useDebounced(searchQuery, 500);

    const { addPlayer, isAdding, list } = useScoutingList();
    const { athletes } = useSupportedAthletes();

    const excludeIds = useMemo(() => {
        return list.map((i) => i.athlete.tracking_id)
    }, [list]);

    const top10 = useMemo(() => {
        const newList = ([...athletes]).sort((a, b) => {
            return (b.power_rank_rating || 0) - (a.power_rank_rating || 0);
        }).filter((p) => {
            return !excludeIds.includes(p.tracking_id)
        });

        return newList.splice(0, 10);
    }, [athletes, excludeIds]);

    const handleAddPlayer = (player: IProAthlete) => {
        addPlayer(player.tracking_id);
    }

    const searchAthletes = useMemo(() => {
        return new AthleteFilterBuilder(athletes)
            .search(debouncedSearchQuery)
            .excludeIds(excludeIds)
            .build();
    }, [athletes, debouncedSearchQuery, excludeIds]);

    return (
        <div className="flex flex-col gap-2 min-h-[80vh]" >

            <div>
                <SecondaryText className="text-md" >Suggested Players</SecondaryText>
            </div>

            <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {!searchQuery && <div className="flex flex-col gap-2" >
                {top10.map((p) => {
                    return (
                        <SuggestedPlayerCard
                            player={p}
                            key={p.tracking_id}
                            isAdding={isAdding}
                            onAdd={handleAddPlayer}
                        />
                    )
                })}
            </div>}

            {searchQuery && (
                <>
                    {searchAthletes.map((p) => {
                        return (
                            <SuggestedPlayerCard 
                                player={p}
                                key={p.tracking_id}
                                isAdding={isAdding}
                                onAdd={handleAddPlayer}
                            />
                        )
                    })}
                </>
            )}

        </div>
    )
}

type SuggestedPlayerCardProps = {
    player: IProAthlete,
    onViewProfile?: (player: IProAthlete) => void,
    onAdd?: (player: IProAthlete) => void,
    isAdding?: boolean
}

function SuggestedPlayerCard({ player, onAdd, onViewProfile, isAdding }: SuggestedPlayerCardProps) {

    const {seasonTeam} = usePlayerSeasonTeam(player);

    const handleAddPlayer = () => {
        if (onAdd) {
            onAdd(player);
        }
    }

    const handleViewProfile = () => {
        if (onViewProfile) {
            onViewProfile(player);
        }
    }

    return (
        <RoundedCard className="dark:border-none p-2 flex flex-row items-center justify-between" >

            <div
                className="flex flex-row items-center gap-2"
                onClick={handleViewProfile}
            >
                <SmartPlayerMugshot
                    teamId={seasonTeam?.athstat_id}
                />

                <div>
                    <p className="text-sm font-semibold" >{player.player_name}</p>
                    <SecondaryText className="text-xs" >{formatPosition(player.position_class)} - {formatPosition(player.position)}</SecondaryText>
                </div>
            </div>

            <div className="flex flex-row items-center gap-2" >
                {/* <MatchPrCard 
                    pr={player.power_rank_rating}
                /> */}

                <PrimaryButton className="w-fit px-2" onClick={handleAddPlayer} disabled={isAdding} >
                    <Plus className="w-4 h-4" />
                </PrimaryButton>
            </div>

        </RoundedCard>
    )
}