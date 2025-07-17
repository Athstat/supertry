import { useState, useCallback, useEffect } from "react";
import { useAthletes } from "../contexts/AthleteContext";
import { usePlayerFiltering } from "../hooks/useAthleteFilter";
import { useDebounced } from "../hooks/useDebounced";

// Components
import { PlayerSearch } from "../components/players/PlayerSearch";
import { PlayerScreenTabs } from "../components/players/PlayerTabs";
import { PlayerFilters } from "../components/players/PlayerFilters";
import { PlayerSort } from "../components/players/PlayerSort";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/players/EmptyState";
import { PlayerGameCard } from "../components/player/PlayerGameCard";
import PageView from "./PageView";
import { Users, X } from "lucide-react";
import PlayersScreenProvider from "../contexts/PlayersScreenContext";
import PlayersCompareButton from "../components/player/PlayerScreenCompareButton";
import { twMerge } from "tailwind-merge";
import PlayerCompareStatus from "../components/players/compare/PlayerCompareStatus";
import PlayerCompareModal from "../components/players/compare/PlayerCompareModal";
import PlayerProfileModal from "../components/player/PlayerProfileModal";
import { SortDirection, SortField, SortTab } from "../types/playerSorting";
import { IProAthlete } from "../types/athletes";
import { IProTeam } from "../types/team";
import TeamLogo from "../components/team/TeamLogo";
import RoundedCard from "../components/shared/RoundedCard";
import SecondaryText from "../components/shared/SecondaryText";
import { useQueryState } from "../hooks/useQueryState";

export const PlayersScreen = () => {

  const { athletes, error, isLoading, refreshAthletes, positions, teams } = useAthletes();

  const [activeTab, setActiveTab] = useState<SortTab>("all");
  const [sortField, setSortField] = useState<SortField>("power_rank_rating");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useQueryState('position');

  const [teamIdFilter, setTeamIdFilter] = useQueryState("team_id");
  const selectedTeam = teams.find(t => t.athstat_id === teamIdFilter);

  // Use debounced search for better performance
  const debouncedSearchQuery = useDebounced(searchQuery, 300);

  // Use optimized filtering hook
  const { filteredPlayers, isEmpty } = usePlayerFiltering({
    athletes,
    searchQuery: debouncedSearchQuery,
    positionFilter,
    selectedTeam,
    activeTab,
    sortField,
    sortDirection,
  });

  // Loading state for filtering operations
  const isFiltering = searchQuery !== debouncedSearchQuery;

  const [isComparing, setIsComparing] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<IProAthlete[]>([]);

  const toggleCompareMode = () => setIsComparing(!isComparing);
  const clearSelections = () => setSelectedPlayers([]);

  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  
  const handleClosePlayerModal = () => {
    setPlayerModalPlayer(undefined);
    setShowPlayerModal(false);
  }

  const onClear = () => {
    clearSelections();
    // toggleCompareMode();
  }

  const onStopComparing = () => {
    clearSelections();
    setIsComparing(false);
  }

  // Handle player selection with useCallback for better performance
  const handlePlayerClick = useCallback((player: IProAthlete) => {
    if (isComparing) {
      setSelectedPlayers(prev => {
        const isSelected = prev.some(p => p.tracking_id === player.tracking_id);
        
        if (isSelected) {
          return prev.filter(p => p.tracking_id !== player.tracking_id);
        } else {
          return [...prev, player];
        }
      });
    } else {
      setPlayerModalPlayer(player);
      setShowPlayerModal(true);
    }
  }, [isComparing]);

  const onRemovePlayerFromSelectedPlayers = useCallback((player: IProAthlete) => {
    setSelectedPlayers(prev => prev.filter(p => p.tracking_id !== player.tracking_id));
  }, []);

  // Handle search filtering
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle tab changes
  const handleTabChange = (tab: SortTab) => {
    setActiveTab(tab);
  };

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

  // Fetch athletes if not already cached
  useEffect(() => {
    if (athletes.length === 0) {
      refreshAthletes();
    }
  }, [athletes.length, refreshAthletes]);

  return (
    <PlayersScreenProvider
      isComparing={isComparing}
      selectedPlayers={selectedPlayers}
    >
      <PageView className="px-5 flex flex-col gap-3 md:w-[80%] lg:w-[60%]">

        {/* Search and Filter Header */}
        <div className="flex flex-row gap-2 items-center" >
          <Users />
          <h1 className="text-2xl font-bold" >Players</h1>
        </div>
        <PlayerSearch searchQuery={searchQuery} onSearch={handleSearch} />
        <div className="flex flex-col gap-1">

          <PlayerScreenTabs activeTab={activeTab} onTabChange={handleTabChange} />

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
              className={twMerge(isComparing && "bg-gradient-to-r from-primary-600 to-blue-700")}
              onClick={toggleCompareMode}
            />
          </div>
        </div>

        {
          <PlayerCompareStatus
            onRemovePlayer={onRemovePlayerFromSelectedPlayers}
            onStopComparing={onStopComparing}
          />
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
        {!isLoading &&
          !error &&
          !isFiltering &&
          isEmpty && (
            <EmptyState
              searchQuery={searchQuery}
              onClearSearch={() => handleSearch("")}
            />
          )}
        {/* Player Grid */}
        {!isLoading && !error && !isFiltering && filteredPlayers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPlayers.map((player) => (
              <PlayerGameCard
                key={player.tracking_id}
                player={player}
                onClick={() => handlePlayerClick(player)}
                className="h-[250px] lg:h-[300px]"
              />
            ))}
          </div>
        )}

        <PlayerCompareModal 
          selectedPlayers={selectedPlayers} 
          open={selectedPlayers.length >= 2 && isComparing}
          onClose={onClear}
          onRemove={onRemovePlayerFromSelectedPlayers}
        />

        {playerModalPlayer && <PlayerProfileModal
          onClose={handleClosePlayerModal}
          player={playerModalPlayer}
          isOpen={playerModalPlayer !== undefined && showPlayerModal}
          
        />}

      </PageView>


    </PlayersScreenProvider>
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
