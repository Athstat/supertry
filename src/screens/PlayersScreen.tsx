import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";

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

// Default competition ID - this could come from a context or route param
const DEFAULT_COMPETITION_ID = "7f6ac8a5-1723-5325-96bd-44b8b36cfb9e";

export const PlayersScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SortTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("points");
  const [sortField, setSortField] = useState<SortField>("power_rank_rating");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<RugbyPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<RugbyPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [positionFilter, setPositionFilter] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await athleteService.getAthletesByCompetition(
          DEFAULT_COMPETITION_ID
        );
        console.log("Players: ", data);
        setPlayers(data);
        setFilteredPlayers(data);

        // Extract unique positions and teams for filters
        const positions = [
          ...new Set(
            data.map((player) => {
              // Capitalize the first letter of position_class
              const position = player.position_class || "";
              return position.charAt(0).toUpperCase() + position.slice(1);
            })
          ),
        ]
          .filter(Boolean)
          .sort();
        const teams = [...new Set(data.map((player) => player.team_name))]
          .filter(Boolean)
          .sort();

        setAvailablePositions(positions);
        setAvailableTeams(teams);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load players");
        console.error("Error fetching players:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Handle player selection
  const handlePlayerClick = (player: RugbyPlayer) => {
    navigate(`/players/${player.tracking_id || player.id}`, {
      state: { player },
    });
  };

  // Handle search filtering
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters();
  };

  // Handle tab changes
  const handleTabChange = (tab: SortTab) => {
    setActiveTab(tab);
    applyFilters();
  };

  // Handle sorting by field and direction
  const handleSortByField = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    applyFilters();
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
    applyFilters();
  };

  // Apply all filters (search, position, team, tab, sort)
  const applyFilters = () => {
    setIsSorting(true);

    setTimeout(() => {
      let result = [...players];

      // Apply search filter
      if (searchQuery.trim()) {
        result = result.filter(
          (player) =>
            player.player_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            player.team_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            player.position_class
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // Apply position filter
      if (positionFilter) {
        result = result.filter((player) => {
          // Capitalize the first letter of position_class for comparison
          const position = player.position_class || "";
          const capitalizedPosition =
            position.charAt(0).toUpperCase() + position.slice(1);
          return capitalizedPosition === positionFilter;
        });
      }

      // Apply team filter
      if (teamFilter) {
        result = result.filter((player) => player.team_name === teamFilter);
      }

      // Apply tab filters
      switch (activeTab) {
        case "all":
          // No additional filtering needed
          break;
        case "trending":
          // Example: Players with recent point increases
          result = result.filter((p) => p.trending === true);
          break;
        case "top":
          // Top performers by fantasy points
          result = result
            .sort(
              (a, b) => (b.power_rank_rating || 0) - (a.power_rank_rating || 0)
            )
            .slice(0, 20);
          break;
        case "new":
          // Example: Recently added players
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
      setIsSorting(false);
    }, 300);
  };

  // Apply filters when they change
  useEffect(() => {
    if (!isLoading && players.length > 0) {
      applyFilters();
    }
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

        {/* Sorting Tabs */}
        <PlayerTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Filter and Sort Buttons */}
        <div className="flex gap-2">
          <PlayerFilters
            positionFilter={positionFilter}
            teamFilter={teamFilter}
            availablePositions={availablePositions}
            availableTeams={availableTeams}
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
      {isLoading && <LoadingState message="Loading players..." />}

      {/* Sorting Loading State */}
      {isSorting && !isLoading && <LoadingState message="Sorting players..." />}

      {/* Error State */}
      {error && !isLoading && !isSorting && (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      )}

      {/* Empty State */}
      {!isLoading && !error && !isSorting && filteredPlayers.length === 0 && (
        <EmptyState
          searchQuery={searchQuery}
          onClearSearch={() => handleSearch("")}
        />
      )}

      {/* Player Grid */}
      {!isLoading && !error && !isSorting && filteredPlayers.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
        </div>
      )}
    </main>
  );
};
