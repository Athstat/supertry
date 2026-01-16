import { useMemo, useState } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker";
import { IProAthlete } from "../../types/athletes";
import SecondaryText from "../ui/typography/SecondaryText";
import { ChevronsUpDown } from "lucide-react";
import WarningCard from "../ui/cards/WarningCard";
import PlayerProfileModal from "../player/PlayerProfileModal";
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList";
import { useNavigate } from "react-router-dom";
import QuickActionButton from "../ui/buttons/QuickActionButton";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import { AthleteFilterBuilder } from "../../utils/athletes/athlete_filter";
import PlayerPickerListLoadingSkeleton from "./PlayerPickerListLoadingSkeleton";
import { PlayerListItem } from "./PlayerPickerListItem";


type SortField = 'power_rank_rating' | 'price' | null;
type SortDirection = 'asc' | 'desc' | null;

type Props = {
    onSelect?: (player: IProAthlete) => void
}

export default function PlayerPickerPlayerList({ onSelect }: Props) {

    const navigate = useNavigate();
    const [sortField, setSortField] = useState<SortField>('power_rank_rating');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const {
        searchQuery, positionPool, availbleTeams,
        filterTeams, excludePlayers,
        remainingBudget, viewType
    } = usePlayerPicker();

    const { list, loadingList } = useScoutingList();
    const {athletes, isLoading: loadingAthletes} = useSupportedAthletes();

    const [profileModalPlayer, setProfileModalPlayer] = useState<IProAthlete>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const toggleModal = () => setShowModal(prev => !prev);

    const handleViewPlayerProfile = (player: IProAthlete) => {
        setProfileModalPlayer(player);
        setShowModal(true);
    }

    const handleSort = (field: SortField) => {
        if (sortField !== field) {
            // Switching to a new field - start with ascending
            setSortField(field);
            setSortDirection('asc');
        } else {
            // Same field - cycle through states
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortDirection('asc');
            }
        }
    };

    const filteredAthletes = useMemo(() => {

        const targetTeamIds = filterTeams ?
            filterTeams.map(t => t.athstat_id)
            : availbleTeams.map((t) => t.athstat_id);

        const excludeAthletesId = excludePlayers.map((a) => {
            return a.tracking_id;
        })

        const builder = new AthleteFilterBuilder(athletes)

        let result = builder
            .positionClass(positionPool)
            .search(searchQuery)
            .teamIds(targetTeamIds)
            .excludeIds(excludeAthletesId)
            .sort(sortField, sortDirection)
            .affordabilitySort(remainingBudget)
            .build();

        if (viewType === "scouting-list") {
            result = [...result].filter((r) => {
                return list.find((a) => a.athlete.tracking_id === r.tracking_id);
            })
        }

        return result;

    }, [filterTeams, availbleTeams, athletes, sortField, sortDirection, viewType, positionPool, searchQuery, excludePlayers, remainingBudget, list]);

    const isLoading = loadingAthletes || (viewType === "scouting-list" && loadingList);

    const handleViewScoutingList = () => {
        navigate(`/scouting/my-list`);
    }

    if (isLoading) {
        return (
            <PlayerPickerListLoadingSkeleton />
        )
    }

    return (
        <div className="overflow-hidden" >

            <WarningCard className="text-xs" >
                <ChevronsUpDown className="w-4 h-4" />
                <p>Players Sorted By <strong>{sortField === "power_rank_rating" ? "Power Ranking" : "Price"}</strong> in <strong>{sortDirection === "asc" ? "from Lowest to Highest" : "Highest to Lowest"}</strong>.</p>
            </WarningCard>

            <table className="w-full table-fixed" >
                <thead>
                    <tr className="cursor-pointer" >
                        <th className="w-[60%]" >
                            <div className="flex flex-row items-center gap-1" >
                                <SecondaryText className="text-xs" >Player</SecondaryText>
                            </div>
                        </th>
                        <th onClick={() => handleSort("price")} className="w-[14%]" >

                            <div className="flex flex-row items-center gap-1" >
                                <SecondaryText className="text-xs" >Price</SecondaryText>
                                <ChevronsUpDown className="w-3 h-3" />
                            </div>

                        </th>

                        <th onClick={() => handleSort("power_rank_rating")} className="w-[11%]" >
                            <div className="flex flex-row items-center gap-1" >
                                <SecondaryText className="text-xs" >PR</SecondaryText>
                                <ChevronsUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="w-[13%]" ><SecondaryText className="text-xs" >Add</SecondaryText></th>
                    </tr>
                </thead>

                <tbody>
                    {filteredAthletes.map((a) => {
                        return (
                            <PlayerListItem
                                player={a}
                                key={a.tracking_id}
                                onViewPlayerProfile={handleViewPlayerProfile}
                                onSelectPlayer={onSelect}
                            />
                        )
                    })}
                </tbody>

            </table>

            {filteredAthletes.length === 0 && list.length > 0 && (
                <div className="flex flex-1 text-center w-full h-[150px] flex-col items-center justify-center gap-2" >
                    <SecondaryText>
                        {`Whoops! No eligable player(s) ${viewType === "scouting-list" ? "from your scouting list were" : ""} found`}
                    </SecondaryText>

                    <QuickActionButton onClick={handleViewScoutingList} showBorder className="border" >View Scouting List</QuickActionButton>
                </div>
            )}

            {list.length === 0 && viewType === "scouting-list" && (
                <div className="flex flex-1 w-full h-[150px] flex-col items-center justify-center gap-4" >
                    <SecondaryText className="text-center" >
                        {`Your scouting list is empty. When you add players to your scouting list, you will be able to see them here`}
                    </SecondaryText>

                    <QuickActionButton onClick={handleViewScoutingList} showBorder className="border" >Get Started with Scouting</QuickActionButton>
                </div>
            )}

            {showModal && profileModalPlayer && (
                <PlayerProfileModal
                    player={profileModalPlayer}
                    isOpen={showModal}
                    onClose={toggleModal}
                />
            )}
        </div>
    )
}