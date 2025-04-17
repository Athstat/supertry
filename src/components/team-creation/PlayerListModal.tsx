import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  User,
  Filter,
  ArrowUpDown,
  Coins,
  Star,
  StarHalf,
} from "lucide-react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";
import { RugbyPlayer } from "../../types/rugbyPlayer";

type SortField = "power_rank_rating" | "player_name" | "price";
type SortDirection = "asc" | "desc";

interface PlayerListModalProps {
  position: Position;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  players?: RugbyPlayer[]; // Add this prop to accept players from parent
  selectedPlayers: Record<string, Player>; // New prop to accept selected players
  // Making all sort/filter props optional
  sortField?: string;
  setSortField?: (field: string) => void;
  sortDirection?: string;
  setSortDirection?: (direction: string) => void;
  positionFilter?: string;
  setPositionFilter?: (position: string) => void;
  teamFilter?: string;
  setTeamFilter?: (team: string) => void;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  showSort?: boolean;
  setShowSort?: (show: boolean) => void;
}

// Add new helper functions at the top of the file (before the type definitions)
const calculateAttackRating = (player: RugbyPlayer | Player): number => {
  const stats = [
    player.ball_carrying || 0,
    player.try_scoring || 0,
    player.offloading || 0,
    player.playmaking || 0,
    player.strength || 0,
  ];

  const sum = stats.reduce((acc, val) => acc + val, 0);
  return stats.filter(Boolean).length > 0
    ? sum / stats.filter(Boolean).length
    : 0;
};

const calculateDefenseRating = (player: RugbyPlayer | Player): number => {
  const stats = [
    player.tackling || 0,
    player.defensive_positioning || 0,
    player.breakdown_work || 0,
    player.discipline || 0,
  ];

  const sum = stats.reduce((acc, val) => acc + val, 0);
  return stats.filter(Boolean).length > 0
    ? sum / stats.filter(Boolean).length
    : 0;
};

const calculateKickingRating = (player: RugbyPlayer | Player): number => {
  const stats = [
    player.points_kicking || 0,
    player.infield_kicking || 0,
    player.tactical_kicking || 0,
    player.goal_kicking || 0,
  ];

  const sum = stats.reduce((acc, val) => acc + val, 0);
  return stats.filter(Boolean).length > 0
    ? sum / stats.filter(Boolean).length
    : 0;
};

// Create a reusable star rating component
const StarRating: React.FC<{ rating: number; maxRating: number }> = ({
  rating,
  maxRating = 5,
}) => {
  // Convert the rating to a 0-5 scale
  const scaledRating = (rating / 10) * maxRating;

  return (
    <div className="flex">
      {Array.from({ length: maxRating }).map((_, i) => {
        if (i < Math.floor(scaledRating)) {
          // Full star
          return (
            <Star
              key={i}
              size={12}
              className="text-primary-500 dark:text-primary-400 fill-current"
            />
          );
        } else if (i < Math.floor(scaledRating + 0.5)) {
          // Half star
          return (
            <StarHalf
              key={i}
              size={12}
              className="text-primary-500 dark:text-primary-400 fill-current"
            />
          );
        } else {
          // Empty star
          return (
            <Star
              key={i}
              size={12}
              className="text-gray-300 dark:text-gray-600"
            />
          );
        }
      })}
    </div>
  );
};

export function PlayerListModal({
  position,
  searchQuery,
  setSearchQuery,
  onClose,
  onSelectPlayer,
  players = [], // Default to empty array
  selectedPlayers, // Accept selected players
  // All props now optional with defaults
  sortField: externalSortField,
  setSortField: externalSetSortField,
  sortDirection: externalSortDirection,
  setSortDirection: externalSetSortDirection,
  positionFilter: externalPositionFilter,
  setPositionFilter: externalSetPositionFilter,
  teamFilter: externalTeamFilter,
  setTeamFilter: externalSetTeamFilter,
  showFilters: externalShowFilters,
  setShowFilters: externalSetShowFilters,
  showSort: externalShowSort,
  setShowSort: externalSetShowSort,
}: PlayerListModalProps) {
  // Local state for when external state is not provided
  const [localSortField, setLocalSortField] =
    useState<string>("power_rank_rating");
  const [localSortDirection, setLocalSortDirection] =
    useState<SortDirection>("desc");
  const [localPositionFilter, setLocalPositionFilter] = useState<string>("");
  const [localTeamFilter, setLocalTeamFilter] = useState<string>("");
  const [localShowFilters, setLocalShowFilters] = useState<boolean>(false);
  const [localShowSort, setLocalShowSort] = useState<boolean>(false);

  // Use external state if available, otherwise use local state
  const sortField = externalSortField ?? localSortField;
  const setSortField = externalSetSortField ?? setLocalSortField;
  const sortDirection = externalSortDirection ?? localSortDirection;
  const setSortDirection = externalSetSortDirection ?? setLocalSortDirection;
  const positionFilter = externalPositionFilter ?? localPositionFilter;
  const setPositionFilter = externalSetPositionFilter ?? setLocalPositionFilter;
  const teamFilter = externalTeamFilter ?? localTeamFilter;
  const setTeamFilter = externalSetTeamFilter ?? setLocalTeamFilter;
  const showFilters = externalShowFilters ?? localShowFilters;
  const setShowFilters = externalSetShowFilters ?? setLocalShowFilters;
  const showSort = externalShowSort ?? localShowSort;
  const setShowSort = externalSetShowSort ?? setLocalShowSort;

  const [filteredPlayers, setFilteredPlayers] = useState<RugbyPlayer[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Extract unique positions and teams for filters
  useEffect(() => {
    if (players.length > 0) {
      const positions = [
        ...new Set(
          players.map((player) => {
            const position = player.position_class || "";
            return position.charAt(0).toUpperCase() + position.slice(1);
          })
        ),
      ]
        .filter(Boolean)
        .sort();

      const teams = [...new Set(players.map((player) => player.team_name))]
        .filter(Boolean)
        .sort();

      setAvailablePositions(positions);
      setAvailableTeams(teams);
    }
  }, [players]);

  // Apply all filters and sorting
  useEffect(() => {
    if (players.length === 0) {
      // Set loading to false even when there are no players
      setLoading(false);
      return;
    }

    let result = [...players];

    // Get already selected player IDs to filter them out
    const selectedPlayerIds = Object.values(selectedPlayers).map(
      (player) => player.id
    );

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(
        (player) =>
          player.player_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          player.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.position_class
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter out already selected players
    result = result.filter((player) => {
      const playerId = player.tracking_id || "";
      return !selectedPlayerIds.includes(playerId);
    });

    // Apply position filter
    if (positionFilter) {
      result = result.filter((player) => {
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
      } else if (sortField === "price") {
        const valueA = a.price || 0;
        const valueB = b.price || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });

    //console.log("Filtered players:", result);
    setFilteredPlayers(result);
    setLoading(false);
  }, [
    players,
    searchQuery,
    positionFilter,
    teamFilter,
    sortField,
    sortDirection,
    selectedPlayers,
  ]);

  // Add this useEffect to ensure loading state is cleared after a timeout
  useEffect(() => {
    // Set a timeout to ensure loading state is cleared after 3 seconds
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  // Convert RugbyPlayer to Player for the onSelectPlayer callback
  const handleSelectPlayer = (rugbyPlayer: RugbyPlayer) => {
    const player: Player = {
      id: rugbyPlayer.id || rugbyPlayer.tracking_id || String(Math.random()),
      name: rugbyPlayer.player_name || "Unknown Player",
      team: rugbyPlayer.team_name || "Unknown Team",
      position: position.name,
      price: rugbyPlayer.price || 0,
      points: rugbyPlayer.power_rank_rating || 0,
      image_url: rugbyPlayer.image_url || "",
      power_rank_rating: rugbyPlayer.power_rank_rating || 0,

      // Database stats (directly from schema)
      points_kicking:
        rugbyPlayer.points_kicking ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      tackling:
        rugbyPlayer.tackling || Number((Math.random() * 2 + 3).toFixed(1)),
      infield_kicking:
        rugbyPlayer.infield_kicking ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      strength:
        rugbyPlayer.strength || Number((Math.random() * 2 + 3).toFixed(1)),
      playmaking:
        rugbyPlayer.playmaking || Number((Math.random() * 2 + 3).toFixed(1)),
      ball_carrying:
        rugbyPlayer.ball_carrying || Number((Math.random() * 2 + 3).toFixed(1)),

      // UI display stats (generated if not available)
      tries: rugbyPlayer.tries || Math.floor(Math.random() * 15),
      assists: rugbyPlayer.assists || Math.floor(Math.random() * 10),
      tackles: rugbyPlayer.tackles || Math.floor(Math.random() * 150 + 50),

      // Derived stats for UI display
      try_scoring:
        rugbyPlayer.try_scoring || Number((Math.random() * 2 + 3).toFixed(1)),
      offloading:
        rugbyPlayer.offloading || Number((Math.random() * 2 + 3).toFixed(1)),
      breakdown_work:
        rugbyPlayer.breakdown_work ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      defensive_positioning:
        rugbyPlayer.defensive_positioning ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      goal_kicking:
        rugbyPlayer.goal_kicking || Number((Math.random() * 2 + 3).toFixed(1)),
      tactical_kicking:
        rugbyPlayer.tactical_kicking ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      penalties_conceded:
        rugbyPlayer.penalties_conceded ||
        Number((Math.random() * 2 + 1).toFixed(1)),
      discipline:
        rugbyPlayer.discipline || Number((Math.random() * 2 + 3).toFixed(1)),
      cards: rugbyPlayer.cards || Number((Math.random() * 2).toFixed(1)),
    };
    onSelectPlayer(player);
  };

  // Handle position filter change
  const handlePositionFilter = (position: string) => {
    setPositionFilter(positionFilter === position ? "" : position);
  };

  // Handle team filter change
  const handleTeamFilter = (team: string) => {
    setTeamFilter(teamFilter === team ? "" : team);
  };

  // Clear all filters
  const clearFilters = () => {
    setPositionFilter("");
    setTeamFilter("");
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200">
      <div className="bg-white dark:bg-[#14181E] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-gray-100">
            Select {position.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b dark:border-gray-800">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-slate-500"
                />
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-gray-200"
                >
                  <Filter size={16} />
                  Filter
                </button>
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-gray-200"
                >
                  <ArrowUpDown size={16} />
                  Sort
                </button>

                {(positionFilter || teamFilter) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg relative border dark:border-slate-700">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="absolute top-3 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                  <div className="mb-3">
                    <h3 className="text-sm font-medium mb-2 dark:text-gray-200">
                      Position
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {availablePositions.map((pos) => (
                        <button
                          key={pos}
                          onClick={() => handlePositionFilter(pos)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            positionFilter === pos
                              ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                              : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2 dark:text-gray-200">
                      Team
                    </h3>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                      {availableTeams.map((team) => (
                        <button
                          key={team}
                          onClick={() => handleTeamFilter(team)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            teamFilter === team
                              ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                              : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                          }`}
                        >
                          {team}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sort Panel */}
              {showSort && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg relative border dark:border-slate-700">
                  <button
                    onClick={() => setShowSort(false)}
                    className="absolute top-3 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                  <h3 className="text-sm font-medium mb-2 dark:text-gray-200">
                    Sort By
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSort("power_rank_rating")}
                      className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                        sortField === "power_rank_rating"
                          ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                          : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                      }`}
                    >
                      Rating
                      {sortField === "power_rank_rating" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSort("player_name")}
                      className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                        sortField === "player_name"
                          ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                          : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                      }`}
                    >
                      Name
                      {sortField === "player_name" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSort("price")}
                      className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                        sortField === "price"
                          ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                          : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                      }`}
                    >
                      Price
                      {sortField === "price" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="overflow-y-auto flex-1 px-2 py-2">
          {filteredPlayers.length === 0 && !loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No players found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPlayers.map((player) => {
                // Calculate ratings
                const attackRating = calculateAttackRating(player);
                const defenseRating = calculateDefenseRating(player);
                const kickingRating = calculateKickingRating(player);

                return (
                  <div
                    key={player.id || player.tracking_id || Math.random()}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => handleSelectPlayer(player)}
                      className="w-full text-left flex flex-col"
                    >
                      {/* Header with PR and price - clean version without percentage */}
                      <div className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-slate-700">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            PR: {player.power_rank_rating || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {player.price || 0}{" "}
                            <Coins size={14} className="inline mr-1" />
                          </span>
                        </div>
                      </div>

                      {/* Player info */}
                      <div className="flex p-3 gap-3">
                        {/* Player Image - enhanced with square format and fade effect */}
                        <div className="flex-shrink-0 relative w-20 h-20 overflow-hidden rounded-lg">
                          {player.image_url ? (
                            <>
                              <img
                                src={player.image_url}
                                alt={player.player_name || "Player"}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.src =
                                    "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                                }}
                              />
                              {/* Gradient overlay for subtle bottom fade effect */}
                              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/40 via-white/10 to-transparent pointer-events-none dark:from-white/50 dark:via-white/15"></div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                              <User size={32} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Player Details */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {player.player_name || "Unknown Player"}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {player.team_name || "Unknown Team"}
                          </p>

                          {/* Stats with star ratings */}
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="flex flex-col">
                              <span className="text-gray-500 dark:text-gray-400">
                                Attack
                              </span>
                              <StarRating rating={attackRating} maxRating={5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 dark:text-gray-400">
                                Defense
                              </span>
                              <StarRating
                                rating={defenseRating}
                                maxRating={5}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 dark:text-gray-400">
                                Kicking
                              </span>
                              <StarRating
                                rating={kickingRating}
                                maxRating={5}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
