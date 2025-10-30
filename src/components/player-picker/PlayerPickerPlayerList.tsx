import { Fragment, useCallback, useMemo, useState } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker";
import { IProAthlete } from "../../types/athletes";
import RoundedCard from "../shared/RoundedCard";
import SecondaryText from "../shared/SecondaryText";
import { athleteSearchPredicate } from "../../utils/athleteUtils";
import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";
import TeamJersey from "../player/TeamJersey";
import { twMerge } from "tailwind-merge";
import { useInView } from "react-intersection-observer";
import { BadgeInfo, ChevronsUpDown } from "lucide-react";
import WarningCard from "../shared/WarningCard";
import PlayerProfileModal from "../player/PlayerProfileModal";
import AvailabilityIcon from "../players/availability/AvailabilityIcon";


type SortField = 'power_rank_rating' | 'price' | null;
type SortDirection = 'asc' | 'desc' | null;

type Props = {
    onSelect?: (player: IProAthlete) => void
}

export default function PlayerPickerPlayerList({ onSelect }: Props) {
    const [sortField, setSortField] = useState<SortField>('power_rank_rating');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const {
        searchQuery, positionPool, availbleTeams,
        leagueRound, filterTeams, excludePlayers,
        maxPrice
    } = usePlayerPicker();

    const key = leagueRound ? `/all-players` : null;
    const { data: fetchedAthletes, isLoading: loadingAthletes } = useSWR(key, () => seasonService.getSeasonAthletes(leagueRound?.season_id ?? ''));

    const athletes = useMemo(() => fetchedAthletes ?? [], [fetchedAthletes]);

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
                const isA_Affordable = (a?.price ?? 0) <= maxPrice;
                const isB_Affordable = (b?.price ?? 0) <= maxPrice;

                const aBias = isA_Affordable ? 0 : 1;
                const bBias = isB_Affordable ? 0 : 1;

                return (aBias - bBias);
            })

        return result;

    }, [filterTeams, availbleTeams, athletes, sortField, sortDirection, positionPool, searchQuery, excludePlayers, maxPrice]);

    const isLoading = loadingAthletes;

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
        <div className="" >

            <WarningCard className="text-xs" >
                <ChevronsUpDown className="w-4 h-4" />
                <p>Players Sorted By <strong>{sortField === "power_rank_rating" ? "Power Ranking" : "Price"}</strong> in <strong>{sortDirection === "asc" ? "from Lowest to Highest" : "Highest to Lowest"}</strong>.</p>
            </WarningCard>

            <div className="flex font-semibold py-2 flex-row items-center justify-between" >

                <div className="flex flex-row  items-center justify-start gap-2 min-w-[230px]" >
                    <SecondaryText className="max-w-[30px]" >Info</SecondaryText>
                    <SecondaryText>Player</SecondaryText>
                </div>

                <div className="grid grid-cols-2 w-[150px] gap-4" >
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => handleSort('power_rank_rating')}
                    >
                        <SecondaryText>
                            PR
                        </SecondaryText>
                        <ChevronsUpDown className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                    </div>

                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => handleSort('price')}
                    >
                        <SecondaryText>Price</SecondaryText>
                        <ChevronsUpDown className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col divide-y dark:divide-slate-700" >
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
            </div>

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
    const { maxPrice } = usePlayerPicker();
    const { inView, ref } = useInView({ triggerOnce: true });

    const isAffordable = (player?.price ?? 0) <= maxPrice;

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
        <div ref={ref} className={twMerge(
            "flex hover:bg-slate-50 flex-row items-center",
            !isAffordable && 'opacity-50',
            "hover:bg-slate-800/50"
        )} >

            {inView && (
                <Fragment>

                    <div
                        onClick={handleViewPlayerProfile}
                        className="w-[30px] cursor-pointer"
                    >
                        <BadgeInfo className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                    </div>

                    <div
                        onClick={handleSelectPlayer}
                        className="flex cursor-pointer  flex-row py-2 items-center justify-between gap-2 w-full"
                    >

                        <div className="flex flex-row items-center gap-2 min-w-[200px]" >

                            <TeamJersey
                                teamId={player.team_id}
                                className={twMerge(
                                    "min-h-10 max-h-10 min-w-10 max-w-10",
                                    "lg:min-h-10 lg:max-h-10 lg:min-w-10 lg:max-w-10"
                                )}
                                key={player.tracking_id}
                                hideFade
                            />

                            <div className="flex flex-col" >
                                <div className="flex flex-row items-center gap-1" >
                                    <p className="text-sm dark:text-white truncate" >{player.player_name}</p>
                                    <AvailabilityIcon 
                                        athlete={player}
                                        iconClassName="w-2 h-2"
                                        className="w-4 h-4 rounded-md"
                                    />
                                </div>
                                
                                {isAffordable && (<SecondaryText className="text-[10px]" >
                                    {player?.team?.athstat_name ?? player.position_class}
                                </SecondaryText>)}

                                {!isAffordable && (
                                    <p className="text-red-500 text-[10px] font-medium" >Can't Afford this Player</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-[150px]" >
                            <SecondaryText>{player.power_rank_rating ? Math.floor(player.power_rank_rating) : '-'}</SecondaryText>
                            <SecondaryText>{player.price}</SecondaryText>
                        </div>
                    </div>

                </Fragment>
            )}
        </div>
    )
}
