import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerForm, RugbyPlayer } from "../types/rugbyPlayer";
import { useAthletes } from "../contexts/AthleteContext";

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
import { Users } from "lucide-react";
import PlayersScreenProvider from "../contexts/PlayersScreenContext";
import PlayersCompareButton from "../components/player/PlayerScreenCompareButton";
import { twMerge } from "tailwind-merge";
import PlayerCompareStatus from "../components/players/compare/PlayerCompareStatus";
import PlayerCompareModal from "../components/players/compare/PlayerCompareModal";
import PlayerProfileModal from "../components/player/PlayerProfileModal";

type SortTab = "all" | "trending" | "top" | "new";
// type SortOption = "points" | "name" | "position" | "club";
type SortDirection = "asc" | "desc";
type SortField = "power_rank_rating" | "player_name" | "form";

export const PlayersScreen = () => {
  const navigate = useNavigate();
  const { athletes, error, isLoading, refreshAthletes, positions, teams } =
    useAthletes();
  const [activeTab, setActiveTab] = useState<SortTab>("all");
  const [sortField, setSortField] = useState<SortField>("power_rank_rating");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<RugbyPlayer[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [positionFilter, setPositionFilter] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");

  const [isComparing, setIsComparing] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<RugbyPlayer[]>([]);
  const toggleCompareMode = () => setIsComparing(!isComparing);
  const clearSelections = () => setSelectedPlayers([]);

  const [playerModalPlayer, setPlayerModalPlayer] = useState<RugbyPlayer>();
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

  // Handle player selection
  const handlePlayerClick = (player: RugbyPlayer) => {

    if (isComparing) {

      const isSelectedAlready = selectedPlayers.find((p) => {
        return p.tracking_id === player.tracking_id;
      });

      if (isSelectedAlready) {

        const newList = selectedPlayers.filter((p) => {
          return p.tracking_id !== player.tracking_id
        });

        setSelectedPlayers(newList);

      } else {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    } else {
      
      setPlayerModalPlayer(player);
      setShowPlayerModal(true);

    }
  };

  const onRemovePlayerFromSelectedPlayers = (player: RugbyPlayer) => {
    const newList = selectedPlayers.filter((p) => {
      return p.tracking_id !== player.tracking_id
    });

    setSelectedPlayers(newList);
  }

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
  const handleTeamFilter = (team: string) => {
    setTeamFilter(team === teamFilter ? "" : team);
  };

  // Clear all filters
  const clearFilters = () => {
    setPositionFilter("");
    setTeamFilter("");
    setSearchQuery("");
  };

  // Apply filters and sorting
  useEffect(() => {
    if (athletes.length === 0) {
      refreshAthletes(); // Fetch athletes if not already cached
    } else {
      setFilteredPlayers(athletes); // Use cached athletes
    }
  }, [athletes, refreshAthletes]);

  // Apply sorting and filtering
  useEffect(() => {
    if (athletes.length === 0) return;

    // Only set isSorting to true when the user applies sorting or filtering
    setIsSorting(true);

    // Use setTimeout to avoid blocking the UI during filtering/sorting
    const timeoutId = setTimeout(() => {
      let result = [...athletes];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (player) =>
            player.player_name?.toLowerCase().includes(query) ||
            player.team_name?.toLowerCase().includes(query) ||
            player.position_class?.toLowerCase().includes(query)
        );
      }

      // Apply position filter
      if (positionFilter) {
        result = result.filter((player) => {
          const position = player.position_class || "";
          return (
            position.charAt(0).toUpperCase() + position.slice(1) ===
            positionFilter
          );
        });
      }

      // Apply team filter
      if (teamFilter) {
        result = result.filter((player) => player.team_name === teamFilter);
      }

      // Apply tab-specific filtering
      switch (activeTab) {
        case "trending":
          result = result.filter(p => p.form === "UP");
          break;
        case "top":
          result = result
            .sort(
              (a, b) => (b.power_rank_rating || 0) - (a.power_rank_rating || 0)
            )
            .slice(0, 20);
          break;
        case "new":
          // result = result.filter((p) => p.isNew === true);
          result = result;
          break;
      }

      // Apply sorting
      result = result.sort((a, b) => {
        if (sortField === "power_rank_rating") {
          const valueA = a.power_rank_rating || 0;
          const valueB = b.power_rank_rating || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
        else if (sortField === "form" && sortDirection === "desc") {

          return formBias(b.power_rank_rating ?? 0, b.form) - formBias(a.power_rank_rating ?? 0, a.form)
        } else if (sortField === "form" && sortDirection === "asc") {

          return formBias(a.power_rank_rating ?? 0, a.form) - formBias(b.power_rank_rating ?? 0, b.form)

        } else if (sortField === "player_name") {
          const valueA = a.player_name || "";
          const valueB = b.player_name || "";
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        return 0;
      });

      setFilteredPlayers(result);
      setIsSorting(false); // Set isSorting to false after sorting is done
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    positionFilter,
    teamFilter,
    searchQuery,
    activeTab,
    sortField,
    sortDirection,
  ]);

  return (
    <PlayersScreenProvider
      isComparing={isComparing}
      selectedPlayers={selectedPlayers}
    >
      <PageView className="px-5 flex flex-col gap-3">

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
              positionFilter={positionFilter}
              teamFilter={teamFilter}
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

        {/* Loading State - for initial load */}
        {isLoading && <LoadingState message="Loading..." />}
        {/* Sorting Loading State */}
        {isSorting && !isLoading && <LoadingState message="Loading..." />}
        {/* Error State */}
        {error && !isLoading && !isSorting && (
          <ErrorState message={error} onRetry={refreshAthletes} />
        )}
        {/* Empty State */}
        {!isLoading &&
          !error &&
          !isSorting &&
          filteredPlayers.length === 0 &&
          athletes.length > 0 && (
            <EmptyState
              searchQuery={searchQuery}
              onClearSearch={() => handleSearch("")}
            />
          )}
        {/* Player Grid */}
        {!isLoading && !error && !isSorting && filteredPlayers.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map((player, index) => (
              <PlayerGameCard
                key={index}
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

const formBias = (powerRanking: number, form?: PlayerForm) => {
  // small influence

  switch (form) {
    case "UP":
      return 3 + powerRanking;
    case "NEUTRAL":
      return 2;
    case "DOWN":
      return -5;
    default:
      return 1; // fallback when form is undefined
  }
}