import { Activity, useCallback, useMemo, useState } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker";
import { IProAthlete } from "../../types/athletes";
import SecondaryText from "../ui/typography/SecondaryText";
import { athleteSearchPredicate } from "../../utils/athleteUtils";
import TeamJersey from "../player/TeamJersey";
import { twMerge } from "tailwind-merge";
import { useInView } from "react-intersection-observer";
import { ChevronsUpDown, Plus } from "lucide-react";
import WarningCard from "../ui/cards/WarningCard";
import PlayerProfileModal from "../player/PlayerProfileModal";
import AvailabilityIcon from "../players/availability/AvailabilityIcon";
import MatchPrCard from "../rankings/MatchPrCard";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList";
import { useNavigate } from "react-router-dom";
import QuickActionButton from "../ui/buttons/QuickActionButton";
import RoundedCard from "../ui/cards/RoundedCard";
import { usePlayerSeasonTeam } from "../../hooks/seasons/useSeasonTeams";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";


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

        let result = athletes
            .filter((a) => {
                if (positionPool === "super-sub") {
                    return true;
                }
                return a.position_class === positionPool
            })
            .filter((a) => {
                if (searchQuery) {
                    return athleteSearchPredicate(a, searchQuery)
                }

                return true;
            })
            .filter((a) => {
                if (targetTeamIds.length > 0) {
                    return targetTeamIds.includes(a.team?.athstat_id ?? '');
                }

                return true;
            })
            .filter((a) => {
                if (excludePlayers.find(p => p.tracking_id === a.tracking_id)) {
                    return false;
                }

                return true;
            })

        // Apply sorting based on state
        if (sortField && sortDirection) {
            result = result.sort((a, b) => {
                let aValue = 0;
                let bValue = 0;

                if (sortField === 'power_rank_rating') {
                    aValue = a.power_rank_rating ?? 0;
                    bValue = b.power_rank_rating ?? 0;
                } else if (sortField === 'price') {
                    aValue = a.price ?? 0;
                    bValue = b.price ?? 0;
                }

                if (sortDirection === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });
        }

        result
            .sort((a, b) => {
                const isA_Affordable = (a?.price ?? 0) <= remainingBudget;
                const isB_Affordable = (b?.price ?? 0) <= remainingBudget;

                const aBias = isA_Affordable ? 0 : 1;
                const bBias = isB_Affordable ? 0 : 1;

                return (aBias - bBias);
            })

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
            <div className="flex flex-col gap-2" >
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
            </div>
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

type PlayerListItemProps = {
    player: IProAthlete,
    onViewPlayerProfile?: (player: IProAthlete) => void,
    onSelectPlayer?: (player: IProAthlete) => void
}

function PlayerListItem({ player, onViewPlayerProfile, onSelectPlayer }: PlayerListItemProps) {

    // const infoButtonRef = useRef<HTMLDivElement | null>(null);
    const { remainingBudget } = usePlayerPicker();
    const { inView, ref } = useInView({ triggerOnce: true });
    const { seasonTeam } = usePlayerSeasonTeam(player);

    const isAffordable = (player?.price ?? 0) <= remainingBudget;

    const handleViewPlayerProfile = () => {
        if (onViewPlayerProfile) {
            onViewPlayerProfile(player);
        }
    }

    const handleSelectPlayer = useCallback(() => {

        if (!isAffordable) {
            return;
        }

        if (onSelectPlayer) {
            onSelectPlayer(player);
            console.log("Player Selected");
        }
    }, [onSelectPlayer, player, isAffordable]);

    return (
        <tr ref={ref} className={twMerge(
            "hover:bg-slate-50 items-center w-[100%]",
            !isAffordable && 'opacity-50',
            "dark:hover:bg-slate-800/50 hover:bg-slate-200"
        )} >
            <Activity mode={inView ? "visible" : "hidden"} >
                <td onClick={handleViewPlayerProfile} className="overflow-clip"  >

                    <div className="flex cursor-pointer flex-row items-center gap-2 w-full" >

                        <TeamJersey
                            teamId={seasonTeam?.athstat_id}
                            className={twMerge(
                                "min-h-10 max-h-10 min-w-10 max-w-10",
                                "lg:min-h-10 lg:max-h-10 lg:min-w-10 lg:max-w-10"
                            )}
                            key={player.tracking_id}
                            hideFade
                        />

                        <div className="flex flex-col w-fit" >
                            <div className="flex flex-row items-center gap-1" >
                                <p className="text-sm dark:text-white truncate" >{player.player_name}</p>
                                <AvailabilityIcon
                                    athlete={player}
                                    iconClassName="w-2 h-2"
                                    className="w-4 h-4 rounded-md"
                                />
                            </div>

                            {isAffordable && (<SecondaryText className="text-[10px]" >
                                {seasonTeam?.athstat_name ?? player.position_class}
                            </SecondaryText>)}

                            {!isAffordable && (
                                <p className="text-red-500 text-[10px] font-medium" >Can't Afford this Player</p>
                            )}
                        </div>
                    </div>

                </td>

                <td className="" >
                    <SecondaryText>{player.price}</SecondaryText>
                </td>

                <td className="" >
                    <MatchPrCard pr={player.power_rank_rating} />
                </td>

                <td className="" >
                    <PrimaryButton onClick={handleSelectPlayer} className="w-fit px-2" >
                        <Plus className="w-4 h-4 " />
                    </PrimaryButton>
                </td>
            </Activity>

        </tr>
    )
}
