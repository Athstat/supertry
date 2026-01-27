import { useAtomValue } from "jotai";
import { ArrowUp, X } from "lucide-react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounced } from "../../hooks/web/useDebounced";
import { usePlayerCompareActions } from "../../hooks/usePlayerCompare";
import { useQueryState } from "../../hooks/web/useQueryState";
import { comparePlayersAtomGroup } from "../../state/comparePlayers.atoms";
import { IProAthlete } from "../../types/athletes"
import { SortField, SortDirection } from "../../types/playerSorting";
import { IProTeam } from "../../types/team";
import { getAthletesSummary } from "../../utils/athletes/athleteUtils";
import PlayerProfileModal from "../player/PlayerProfileModal";
import SecondaryText from "../ui/typography/SecondaryText";
import TeamLogo from "../team/TeamLogo";
import PlayerCompareModal from "./compare/PlayerCompareModal";
import PlayersScreenCompareStatus from "./compare/PlayersScreenCompareStatus";
import { twMerge } from "tailwind-merge";
import { AppColours } from "../../types/constants";
import { PlayerListTable } from "./PlayerListTable";
import RoundedCard from "../ui/cards/RoundedCard";
import useAthleteFilter from "../../hooks/athletes/useAthleteFilter";
import StaticSearchBarArea from "./StatisSearchBarArea";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useInView } from "react-intersection-observer";
import { useSeasonTeams } from "../../hooks/seasons/useSeasonTeams";
import PlayersListFilterModal from "./PlayerListFilterModal";

type Props = {
    players: IProAthlete[],
    stickyHeaderClassName?: string
}

/** Renders a list of player cards, with functionality to filter sort etc */
export default function PlayersList({ players, stickyHeaderClassName }: Props) {
    const displayedAthletes = players;
    const [params, setParams] = useSearchParams();

    // Derive available teams/positions from the displayed dataset
    const { positions: availablePositions } = useMemo(() => {
        return getAthletesSummary(displayedAthletes);
    }, [displayedAthletes]);

    const { teams: availableTeams } = useSeasonTeams();

    const [sortField, setSortField] = useState<SortField>('power_rank_rating');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });
    const [positionFilter, setPositionFilter] = useQueryState<string | undefined>('position');

    const [teamIdFilter, setTeamIdFilter] = useQueryState<string | undefined>('team_id');
    const selectedTeam = availableTeams.find(t => t.athstat_id === teamIdFilter);

    const { ref: topPageRef, inView: isTopPageRefVisible } = useInView();

    // Ensure team filter remains valid when dataset changes
    useEffect(() => {
        if (teamIdFilter && !availableTeams.some(t => t.athstat_id === teamIdFilter)) {
            setTeamIdFilter('');
        }
    }, [availableTeams, setTeamIdFilter, teamIdFilter]);

    // Use debounced search for better performance
    const debouncedSearchQuery = useDebounced(searchQuery, 300);

    const selectedPositions: string[] = useMemo(() => {
        return positionFilter ? [positionFilter] : [];
    }, [positionFilter]);

    const selectedTeamIds: string[] = useMemo(() => {
        return selectedTeam ? [selectedTeam.athstat_id] : [];
    }, [selectedTeam]);

    // Use optimized filtering hook
    const { filteredAthletes, isFiltering } = useAthleteFilter({
        athletes: displayedAthletes,
        searchQuery: debouncedSearchQuery,
        selectedPositions: selectedPositions,
        selectedTeamIds: selectedTeamIds,
        sortField,
        sortDirection,
    });

    const [controlsOpen, setControlsOpen] = useState(false);
    const toggleControls = () => setControlsOpen(prev => !prev);

    const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
    const [showPlayerModal, setShowPlayerModal] = useState(false);

    const handleClosePlayerModal = () => {
        setPlayerModalPlayer(undefined);
        setShowPlayerModal(false);
    };

    const isPickingPlayers = useAtomValue(comparePlayersAtomGroup.isCompareModePicking);

    const { addOrRemovePlayer, startPicking, showCompareModal } = usePlayerCompareActions();

    // Handle player selection with useCallback for better performance
    const handlePlayerClick = useCallback(
        (player: IProAthlete) => {
            if (isPickingPlayers) {
                addOrRemovePlayer(player);
            } else {
                setPlayerModalPlayer(player);
                setShowPlayerModal(true);
            }
        },
        [addOrRemovePlayer, isPickingPlayers]
    );

    // Handle search filtering
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Handle sorting by field and direction
    const handleSortByField = (field: SortField, direction: SortDirection) => {
        setSortField(field);
        setSortDirection(direction);
    };

    // Handle position filter change
    const handlePositionFilter = (position: string) => {
        setPositionFilter(position === positionFilter ? '' : position);
    };

    // Handle team filter change
    const handleTeamFilter = (team: IProTeam) => {
        setTeamIdFilter(team.athstat_id);
    };

    // Clear all filters (batch in a single URLSearchParams update)
    const clearFilters = () => {
        const next = new URLSearchParams(params);
        next.delete('position');
        next.delete('team_id');
        next.delete('query');
        setParams(next, { replace: true });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div>

            <StaticSearchBarArea
                value={searchQuery ?? ''}
                onChange={handleSearch}
                onOpenControls={() => setControlsOpen(true)}
                onOpenCompare={() => (isPickingPlayers ? showCompareModal() : startPicking())}
                isComparePicking={isPickingPlayers}
                stickyHeaderClassName={stickyHeaderClassName}
            />
            <PlayersScreenCompareStatus />

            <div ref={topPageRef} ></div>


            <div className={twMerge(
                "flex flex-col items-center justify-center flex-wrap",
                AppColours.BACKGROUND,
                "bg-[#F0F3F7]"

            )}>

                {/* Selected Team Section */}
                <div className="flex flex-row items-start w-full" >
                    {selectedTeam && (
                        <RoundedCard className="flex w-fit px-2 py-0.5 dark:bg-slate-800 flex-row items gap-2">
                            <TeamLogo
                                teamName={selectedTeam.athstat_name}
                                url={selectedTeam.image_url}
                                className="w-5 h-5"
                            />

                            <p>{selectedTeam.athstat_name}</p>

                            <button onClick={() => setTeamIdFilter('')}>
                                <SecondaryText>
                                    {' '}
                                    <X className="w-4 h-4" />{' '}
                                </SecondaryText>
                            </button>
                        </RoundedCard>
                    )}
                </div>

                {/* Filtering Loading State */}
                {/* {isFiltering && <LoadingState message="Searching..." />} */}


                {/* Player Grid */}
                {/* {!isFiltering && (
                    <div
                        data-player-grid
                        className="grid items-center justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-2 md:gap-y-3"
                    >
                        {filteredAthletes.map(player => (
                            <PlayerCardItem
                                player={player}
                                onClick={() => handlePlayerClick(player)}
                                key={player.tracking_id}
                            />
                        ))}
                    </div>
                )} */}

                {/* Player List */}
                {!isFiltering && (
                    <PlayerListTable
                        players={filteredAthletes}
                        onClick={handlePlayerClick}
                        onSort={handleSortByField}
                        currentSortDirection={sortDirection}
                        currentSortField={sortField}
                        searchQuery={searchQuery}
                        onClearSearchQuery={() => setSearchQuery("")}
                    />
                )}


                <div>
                    {!isTopPageRefVisible && (
                        <PrimaryButton
                            className="fixed bottom-20 right-0 rounded-full w-11 h-11 shadow-md mx-4"
                            onClick={scrollToTop}
                        >
                            <ArrowUp />
                        </PrimaryButton>
                    )}
                </div>

                <PlayerCompareModal />

                {playerModalPlayer && (
                    <PlayerProfileModal
                        onClose={handleClosePlayerModal}
                        player={playerModalPlayer}
                        isOpen={playerModalPlayer !== undefined && showPlayerModal}
                    />
                )}
            </div>

            <PlayersListFilterModal
                isOpen={controlsOpen}
                onClose={toggleControls}
                positionFilter={positionFilter ?? ''}
                selectedTeam={selectedTeam}
                availablePositions={availablePositions}
                handlePositionFilter={handlePositionFilter}
                handleTeamFilter={handleTeamFilter}
                clearFilters={clearFilters}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSortByField={handleSortByField}
            />
        </div>
    );
};