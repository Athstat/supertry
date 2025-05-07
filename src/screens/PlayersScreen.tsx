import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { useAthletes } from "../contexts/AthleteContext";

// Components
import { PlayerCard } from "../components/players/PlayerCard";
import { PlayerSearch } from "../components/players/PlayerSearch";
import { PlayerTabs } from "../components/players/PlayerTabs";
import { PlayerFilters } from "../components/players/PlayerFilters";
import { PlayerSort } from "../components/players/PlayerSort";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/players/EmptyState";

type SortTab = "all" | "trending" | "top" | "new";
type SortOption = "points" | "name" | "position" | "club";
type SortDirection = "asc" | "desc";
type SortField = "power_rank_rating" | "player_name";

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

  // Handle player selection
  const handlePlayerClick = (player: RugbyPlayer) => {
    navigate(`/players/${player.tracking_id || player.id}`, {
      state: { player },
    });
  };

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
          result = result.filter((p) => p.trending === true);
          break;
        case "top":
          result = result
            .sort(
              (a, b) => (b.power_rank_rating || 0) - (a.power_rank_rating || 0)
            )
            .slice(0, 20);
          break;
        case "new":
          result = result.filter((p) => p.isNew === true);
          break;
      }

      // Apply sorting
      result = result.sort((a, b) => {
        if (sortField === "power_rank_rating") {
          const valueA = a.power_rank_rating || 0;
          const valueB = b.power_rank_rating || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
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
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Search and Filter Header */}
      <div className="space-y-4 mb-6">
        <PlayerSearch searchQuery={searchQuery} onSearch={handleSearch} />
        <PlayerTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="flex gap-2">
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
        </div>
      </div>

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
            <PlayerCard
              key={index}
              player={player}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
        </div>
      )}
    </main>
  );
};
