import React, { useState, useRef, useEffect } from "react";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { Player } from "../../../types/player";
import {
  User,
  Star,
  Zap,
  Award,
  Plus,
  Loader2,
  ChevronRight,
  Info,
} from "lucide-react";
import { createPlayerFromRugbyPlayer } from "../../../utils/playerRatings";
import { motion, AnimatePresence } from "framer-motion";

// Type for sort direction
type SortDirection = "asc" | "desc";

interface PlayerListViewProps {
  filteredPlayers: RugbyPlayer[];
  onSelectPlayer: (player: Player) => void;
  positionName: string;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: string;
  setSortDirection: (direction: string) => void;
}

// PlayerTooltip component for showing more info on hover
const PlayerTooltip: React.FC<{ player: RugbyPlayer }> = ({ player }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-30 left-[180px] bg-white dark:bg-dark-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 w-64 pointer-events-none"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {player.image_url ? (
            <img
              src={player.image_url}
              alt={player.player_name}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {player.player_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {player.team_name} | {player.position_class}
          </p>
          <div className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
            £{player.price}M
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Try Scoring:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {player.try_scoring || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Ball Carrying:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {player.ball_carrying || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tackling:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {player.tackling || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Defensive Positioning:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {player.defensive_positioning || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Playmaking:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {player.playmaking || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const PlayerListView: React.FC<PlayerListViewProps> = ({
  filteredPlayers,
  onSelectPlayer,
  positionName,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  const [loadingPlayers, setLoadingPlayers] = useState<Record<string, boolean>>(
    {}
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "power_rank_rating",
    "price",
    "attack",
    "defense",
    "kicking",
    "try_scoring",
    "playmaking",
    "tackling",
    "discipline",
  ]);

  // Add state for tooltip
  const [tooltipPlayer, setTooltipPlayer] = useState<RugbyPlayer | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Adjust visible columns based on screen width
      if (window.innerWidth < 768) {
        setVisibleColumns(["power_rank_rating", "price", "attack"]);
      } else if (window.innerWidth < 1024) {
        setVisibleColumns([
          "power_rank_rating",
          "price",
          "attack",
          "defense",
          "kicking",
        ]);
      } else {
        setVisibleColumns([
          "power_rank_rating",
          "price",
          "attack",
          "defense",
          "kicking",
          "try_scoring",
          "playmaking",
          "tackling",
          "discipline",
        ]);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Helper functions for rating calculations (same as before)
  const calculateAttackRating = (player: RugbyPlayer): number => {
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

  const calculateDefenseRating = (player: RugbyPlayer): number => {
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

  const calculateKickingRating = (player: RugbyPlayer): number => {
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

  // Handle sorting by clicking on column headers
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

  // Handle adding a player directly from list view
  const handleAddPlayer = async (rugbyPlayer: RugbyPlayer) => {
    const playerId = rugbyPlayer.tracking_id || "";

    // Set loading state for this specific player
    setLoadingPlayers((prev) => ({ ...prev, [playerId]: true }));

    try {
      // Create a Player object from RugbyPlayer
      const player = createPlayerFromRugbyPlayer(rugbyPlayer, positionName);

      // Add a small delay to show loading state (for better UX)
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Call the onSelectPlayer prop to add the player
      onSelectPlayer(player);
    } finally {
      // Clear loading state after a delay for better UX feedback
      setTimeout(() => {
        setLoadingPlayers((prev) => ({ ...prev, [playerId]: false }));
      }, 300);
    }
  };

  // Check if a player is a league leader (power rank > 85)
  const isLeagueLeader = (player: RugbyPlayer): boolean => {
    return (player.power_rank_rating || 0) >= 85;
  };

  // Check if a player is "on fire" (power rank > 80)
  const isOnFire = (player: RugbyPlayer): boolean => {
    return (
      (player.power_rank_rating || 0) >= 80 &&
      (player.power_rank_rating || 0) < 85
    );
  };

  // Convert rating value to star display (0-5 scale)
  const ratingToStars = (rating: number): number => {
    return Math.min(5, Math.max(0, Math.round((rating / 100) * 5)));
  };

  // Render star ratings (0-5 scale)
  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < count ? "currentColor" : "none"}
            className={
              i < count ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
      </div>
    );
  };

  // Function to render column header with sort indicator
  const renderSortableHeader = (title: string, field: string) => {
    const isActive = sortField === field;
    const sortIcon = sortDirection === "asc" ? "↑" : "↓";
    const isVisible = visibleColumns.includes(field);

    if (!isVisible) return null;

    return (
      <th
        onClick={() => handleSort(field)}
        className={`px-2 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800/50 whitespace-nowrap text-sm font-medium transition-colors ${
          isActive
            ? "text-primary-600 dark:text-primary-400"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <div className="flex items-center gap-1">
          <span>{title}</span>
          {isActive && <span className="text-xs">{sortIcon}</span>}
        </div>
      </th>
    );
  };

  // Function to render a stat column for a player
  const renderStatColumn = (field: string, value: number) => {
    const isVisible = visibleColumns.includes(field);

    if (!isVisible) return null;

    return <td className="px-2 py-3">{renderStars(ratingToStars(value))}</td>;
  };

  // Render the player rows
  const renderPlayerRow = (player: RugbyPlayer) => {
    const playerId = player.tracking_id || "";
    const isLoading = loadingPlayers[playerId];
    const attackRating = calculateAttackRating(player);
    const defenseRating = calculateDefenseRating(player);
    const kickingRating = calculateKickingRating(player);

    return (
      <tr
        key={playerId}
        className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-800/30 transition-colors relative"
        onMouseEnter={() => !isMobile && setTooltipPlayer(player)}
        onMouseLeave={() => !isMobile && setTooltipPlayer(null)}
      >
        {/* Sticky player info column */}
        <td className="sticky left-0 z-10 bg-white dark:bg-dark-850 p-2 min-w-[150px] md:min-w-[180px] hover:bg-gray-50 dark:hover:bg-dark-800/30">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleAddPlayer(player)}
          >
            {/* Player image */}
            <div className="relative w-10 h-10 flex-shrink-0">
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.player_name}
                  className="w-10 h-10 object-cover rounded-lg bg-gray-200 dark:bg-gray-800"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
              )}

              {/* Badges */}
              {isLeagueLeader(player) && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <Award
                    size={16}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                </span>
              )}
              {isOnFire(player) && !isLeagueLeader(player) && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <Zap size={16} className="text-red-500" fill="currentColor" />
                </span>
              )}
            </div>

            {/* Player details */}
            <div className="flex flex-col min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {player.player_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {player.team_name}
              </div>
              <div className="text-xs font-medium text-primary-600 dark:text-primary-400">
                £{player.price}M
              </div>
            </div>

            {/* Add button/indicator */}
            <div className="ml-auto flex-shrink-0">
              {isLoading ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <Loader2
                    size={14}
                    className="animate-spin text-primary-500"
                  />
                </div>
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </div>
          </div>
        </td>

        {/* Power rank rating */}
        {visibleColumns.includes("power_rank_rating") && (
          <td className="px-2 py-3 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-semibold">
              {player.power_rank_rating}
            </div>
          </td>
        )}

        {/* Price */}
        {visibleColumns.includes("price") && (
          <td className="px-2 py-3 text-center text-sm font-medium">
            £{player.price}M
          </td>
        )}

        {/* Attack rating */}
        {renderStatColumn("attack", attackRating)}

        {/* Defense rating */}
        {renderStatColumn("defense", defenseRating)}

        {/* Kicking rating */}
        {renderStatColumn("kicking", kickingRating)}

        {/* Additional stats with simple star ratings */}
        {renderStatColumn("try_scoring", player.try_scoring || 0)}
        {renderStatColumn("playmaking", player.playmaking || 0)}
        {renderStatColumn("tackling", player.tackling || 0)}
        {renderStatColumn("discipline", player.discipline || 0)}

        {/* Tooltip shows when row is hovered on desktop */}
        {tooltipPlayer &&
          tooltipPlayer.tracking_id === player.tracking_id &&
          !isMobile && (
            <td className="absolute top-0 left-0 h-0 w-0 overflow-visible pointer-events-none">
              <PlayerTooltip player={player} />
            </td>
          )}
      </tr>
    );
  };

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-dark-850 z-10 shadow-sm">
            <tr className="border-b dark:border-gray-700">
              {/* Fixed width player info column */}
              <th className="w-[150px] min-w-[150px] md:min-w-[180px] sticky left-0 z-20 bg-white dark:bg-dark-850 px-2 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Player
                <span className="ml-1 text-xs text-gray-400 hidden md:inline">
                  (tap to add)
                </span>
              </th>

              {/* Stat columns */}
              {renderSortableHeader("Power", "power_rank_rating")}
              {renderSortableHeader("Price", "price")}
              {renderSortableHeader("Attack", "attack")}
              {renderSortableHeader("Defense", "defense")}
              {renderSortableHeader("Kicking", "kicking")}

              {/* Additional stats */}
              {renderSortableHeader("Try Scoring", "try_scoring")}
              {renderSortableHeader("Playmaking", "playmaking")}
              {renderSortableHeader("Tackling", "tackling")}
              {renderSortableHeader("Discipline", "discipline")}
            </tr>
          </thead>
          <tbody>{filteredPlayers.map(renderPlayerRow)}</tbody>
        </table>
      </div>
    </div>
  );
};
