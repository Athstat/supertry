import { useState, useCallback, useMemo, Fragment } from "react";
import { useAthletes } from "../contexts/AthleteContext";
import { useDebounced } from "../hooks/useDebounced";

// Components
import { PlayerSearch } from "../components/players/PlayerSearch";
import { PlayerFilters } from "../components/players/PlayerFilters";
import { PlayerSort } from "../components/players/PlayerSort";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/players/EmptyState";
import { PlayerGameCard } from "../components/player/PlayerGameCard";
import PageView from "./PageView";
import { Users, X } from "lucide-react";
import PlayersCompareButton from "../components/player/PlayerScreenCompareButton";
import { twMerge } from "tailwind-merge";
import PlayersScreenCompareStatus from "../components/players/compare/PlayersScreenCompareStatus";
import PlayerCompareModal from "../components/players/compare/PlayerCompareModal";
import PlayerProfileModal from "../components/player/PlayerProfileModal";
import { SortDirection, SortField } from "../types/playerSorting";
import { IProAthlete } from "../types/athletes";
import { IProTeam } from "../types/team";
import TeamLogo from "../components/team/TeamLogo";
import RoundedCard from "../components/shared/RoundedCard";
import SecondaryText from "../components/shared/SecondaryText";
import { useQueryState } from "../hooks/useQueryState";
import useAthleteFilter from "../hooks/useAthleteFilter";
import PlayerCompareProvider from "../components/players/compare/PlayerCompareProvider";
import { usePlayerCompareActions } from "../hooks/usePlayerCompare";
import { useAtomValue } from "jotai";
import { comparePlayersAtomGroup } from "../state/comparePlayers.atoms";

export function PlayersScreen() {
  return (
    <PlayerCompareProvider>
      <PlayerScreenContent />
    </PlayerCompareProvider>
  )
}

export const PlayerScreenContent = () => {

  const { athletes, error, isLoading, refreshAthletes, positions, teams } = useAthletes();

  // const [activeTab, setActiveTab] = useState<SortTab>("all");
  const [sortField, setSortField] = useState<SortField>("power_rank_rating");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useQueryState('position');

  const [teamIdFilter, setTeamIdFilter] = useQueryState("team_id");
  const selectedTeam = teams.find(t => t.athstat_id === teamIdFilter);

  // Use debounced search for better performance
  const debouncedSearchQuery = useDebounced(searchQuery, 300);

  const selectedPositions = useMemo(() => {
    return positionFilter ? [positionFilter] : [];
  }, [positionFilter]);

  const selectedTeamIds = useMemo(() => {
    return selectedTeam ? [selectedTeam.athstat_id] : []
  }, [selectedTeam]);

  // Use optimized filtering hook
  const { filteredAthletes, isFiltering } = useAthleteFilter({
    athletes: athletes,
    searchQuery: debouncedSearchQuery,
    selectedPositions: selectedPositions,
    selectedTeamIds: selectedTeamIds,
    sortField,
    sortDirection,
  });

  const isEmpty = !isLoading && !isFiltering && filteredAthletes.length === 0;

  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const handleClosePlayerModal = () => {
    setPlayerModalPlayer(undefined);
    setShowPlayerModal(false);
  }

  const isPickingPlayers = useAtomValue(
    comparePlayersAtomGroup.isCompareModePicking
  );

  const {addOrRemovePlayer} = usePlayerCompareActions();

  // Handle player selection with useCallback for better performance
  const handlePlayerClick = useCallback((player: IProAthlete) => {
    
    if (isPickingPlayers) {
      addOrRemovePlayer(player);
    } else {
      setPlayerModalPlayer(player);
      setShowPlayerModal(true);
    }

  }, [isPickingPlayers]);


  // Handle search filtering
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // // Handle tab changes
  // const handleTabChange = (tab: SortTab) => {
  //   setActiveTab(tab);
  // };

  // Handle sorting by field and direction
  const handleSortByField = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Handle position filter change
  const handlePositionFilter = (position: string) => {
    setPositionFilter(position === positionFilter ? "" : position);
  };

  // Handle team filter change
  const handleTeamFilter = (team: IProTeam) => {
    setTeamIdFilter(team.athstat_id);
  };

  // Clear all filters
  const clearFilters = () => {
    setPositionFilter("");
    setTeamIdFilter("");
    setSearchQuery("");
  };

  return (
    <Fragment
    >
      <PageView className="px-5 flex flex-col gap-3 md:w-[80%] lg:w-[60%]">

        {/* Search and Filter Header */}
        <div className="flex flex-row gap-2 items-center" >
          <Users />
          <h1 className="text-2xl font-bold" >Players</h1>
        </div>
        <PlayerSearch searchQuery={searchQuery} onSearch={handleSearch} />
        <div className="flex flex-col gap-1">

          {/* <PlayerScreenTabs activeTab={activeTab} onTabChange={handleTabChange} /> */}

          <div className="flex flex-row flex-wrap gap-2 relative overflow-visible">

            <PlayerFilters
              positionFilter={positionFilter ?? ''}
              teamFilter={selectedTeam}
              availablePositions={positions}
              availableTeams={teams}
              onPositionFilter={handlePositionFilter}
              onTeamFilter={handleTeamFilter}
              onClearFilters={clearFilters}
            />

            <PlayerSort
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSortByField}
            />

            <PlayersCompareButton
              className={twMerge(isPickingPlayers && "bg-gradient-to-r from-primary-600 to-blue-700")}
            />
          </div>
        </div>

        {
          <PlayersScreenCompareStatus/>
        }

        {/* Selected Team Section */}
        <div>
          {selectedTeam && <RoundedCard className="flex w-fit px-2 py-0.5 dark:bg-slate-800 flex-row items-center gap-2" >
            <TeamLogo 
              teamName={selectedTeam.athstat_name}
              url={selectedTeam.image_url}
              className="w-5 h-5"
            />

            <p>{selectedTeam.athstat_name}</p>
            
            <button onClick={() => setTeamIdFilter("")} >
              <SecondaryText> <X className="w-4 h-4" /> </SecondaryText>
            </button>

          </RoundedCard>}
        </div>

        {/* Loading State - for initial load */}
        {isLoading && <LoadingState message="Loading..." />}

        {/* Filtering Loading State */}
        {isFiltering && !isLoading && <LoadingState message="Searching..." />}

        {/* Error State */}
        {error && !isLoading && !isFiltering && (
          <ErrorState message={error} onRetry={refreshAthletes} />
        )}

        {/* Empty State */}
        { isEmpty && (
            <EmptyState
              searchQuery={searchQuery}
              onClearSearch={() => handleSearch("")}
            />
          )}

        {/* Player Grid */}
        {!isLoading && !error && !isFiltering && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAthletes.map((player) => (
              <PlayerGameCard
                key={player.tracking_id}
                player={player}
                onClick={() => handlePlayerClick(player)}
                className="h-[250px] lg:h-[300px]"
              />
            ))}
          </div>
        )}

        <PlayerCompareModal />

        {playerModalPlayer && <PlayerProfileModal
          onClose={handleClosePlayerModal}
          player={playerModalPlayer}
          isOpen={playerModalPlayer !== undefined && showPlayerModal}
          
        />}

      </PageView>


    </Fragment>
  );
};

// const formBias = (powerRanking: number, form?: PlayerForm) => {
//   // small influence

//   switch (form) {
//     case "UP":
//       return 3 + powerRanking;
//     case "NEUTRAL":
//       return 2;
//     case "DOWN":
//       return -5;
//     default:
//       return 1; // fallback when form is undefined
//   }
// }
