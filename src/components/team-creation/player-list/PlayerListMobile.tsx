import React, { useState, useRef, useEffect } from "react";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { Player } from "../../../types/player";
import { SortableHeader } from "./SortableHeader";
import { PlayerRowMobile } from "./PlayerRowMobile";
import { createPlayerFromRugbyPlayer } from "../../../utils/playerRatings";
import { EmptyState } from "./EmptyState";
import { LoadingSpinner } from "./LoadingSpinner";

export type SortField =
  | "price"
  | "power_rank_rating"
  | "attack"
  | "defense"
  | "kicking";

type SortDirection = "asc" | "desc" | null;

interface PlayerListMobileProps {
  filteredPlayers: RugbyPlayer[];
  onSelectPlayer: (player: Player) => void;
  onViewDetails?: (player: RugbyPlayer) => void; // Handler for viewing player details
  positionName: string;
  selectedPlayers?: Record<string, Player>;
  loading?: boolean;
}

export const PlayerListMobile: React.FC<PlayerListMobileProps> = ({
  filteredPlayers,
  onSelectPlayer,
  onViewDetails,
  positionName,
  selectedPlayers = {},
  loading = false,
}) => {
  // Local sort state
  const [sortField, setSortField] = useState<SortField | null>(
    "power_rank_rating"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to add shadow to sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setIsScrolled(containerRef.current.scrollTop > 0);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Function to check if a player is already selected
  const isPlayerSelected = (playerId: string): boolean => {
    return Object.keys(selectedPlayers).includes(playerId);
  };

  // Handle sort toggling
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction cycle: desc -> asc -> null (no sort)
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("desc");
      }
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Default handler for view details if not provided
  const handleViewDetails =
    onViewDetails ||
    ((player: RugbyPlayer) => {
      console.log("View details for player:", player.player_name);
    });

  // Sort the players based on current sort settings
  const getSortedPlayers = (): RugbyPlayer[] => {
    if (!sortField || !sortDirection) return filteredPlayers;

    const sorted = [...filteredPlayers];

    return sorted.sort((a, b) => {
      let valueA = 0;
      let valueB = 0;

      // Determine values based on sort field
      if (sortField === "price") {
        valueA = a.price || 0;
        valueB = b.price || 0;
      } else if (sortField === "power_rank_rating") {
        valueA = a.power_rank_rating || 0;
        valueB = b.power_rank_rating || 0;
      } else {
        // For other fields, we need to calculate composite ratings
        const getPlayerValue = (player: RugbyPlayer, field: SortField) => {
          if (field === "attack") {
            const stats = [
              player.ball_carrying || 0,
              player.try_scoring || 0,
              player.offloading || 0,
              player.playmaking || 0,
              player.strength || 0,
            ];
            return stats.filter(Boolean).length > 0
              ? stats.reduce((acc, val) => acc + val, 0) /
                  stats.filter(Boolean).length
              : 0;
          } else if (field === "defense") {
            const stats = [
              player.tackling || 0,
              player.defensive_positioning || 0,
              player.breakdown_work || 0,
              player.discipline || 0,
            ];
            return stats.filter(Boolean).length > 0
              ? stats.reduce((acc, val) => acc + val, 0) /
                  stats.filter(Boolean).length
              : 0;
          } else if (field === "kicking") {
            const stats = [
              player.points_kicking || 0,
              player.infield_kicking || 0,
              player.tactical_kicking || 0,
              player.goal_kicking || 0,
            ];
            return stats.filter(Boolean).length > 0
              ? stats.reduce((acc, val) => acc + val, 0) /
                  stats.filter(Boolean).length
              : 0;
          }
          return 0;
        };

        valueA = getPlayerValue(a, sortField);
        valueB = getPlayerValue(b, sortField);
      }

      // Apply sort direction
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
  };

  const sortedPlayers = getSortedPlayers();

  return (
    <div className="w-full overflow-hidden h-full flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : sortedPlayers.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          ref={containerRef}
          className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 relative"
        >
          <table className="w-full border-collapse table-fixed">
            <thead
              className={`sticky top-0 z-20 transition-shadow duration-200 ${
                isScrolled
                  ? "shadow-[0_4px_10px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_10px_-4px_rgba(0,0,0,0.2)]"
                  : ""
              }`}
            >
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {/* Player image column - fixed width */}
                <th className="w-[2.5rem] bg-white/95 dark:bg-dark-850/95 backdrop-blur-sm p-0"></th>

                {/* Stats header cells - with improved spacing */}
                <SortableHeader
                  title="COST"
                  sortField="price"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("price")}
                  className="bg-white/95 dark:bg-dark-850/95 backdrop-blur-sm w-[15%]"
                />

                <SortableHeader
                  title="PR"
                  sortField="power_rank_rating"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("power_rank_rating")}
                  className="bg-white/95 dark:bg-dark-850/95 backdrop-blur-sm w-[15%]"
                />

                <SortableHeader
                  title="ATK"
                  sortField="attack"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("attack")}
                  className="bg-white/95 dark:bg-dark-850/95 backdrop-blur-sm w-[15%]"
                />

                <SortableHeader
                  title="DEF"
                  sortField="defense"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("defense")}
                  className="bg-white/95 dark:bg-dark-850/95 backdrop-blur-sm w-[15%]"
                />

                <SortableHeader
                  title="KCK"
                  sortField="kicking"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("kicking")}
                  className="bg-white/95 dark:bg-dark-850/95 backdrop-blur-sm w-[15%]"
                />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/70">
              {sortedPlayers.map((player) => {
                const playerId = player.tracking_id || player.id || "";

                return (
                  <PlayerRowMobile
                    key={playerId}
                    player={player}
                    onSelectPlayer={onSelectPlayer}
                    onViewDetails={handleViewDetails}
                    positionName={positionName}
                    createPlayerFromRugbyPlayer={createPlayerFromRugbyPlayer}
                    isSelected={isPlayerSelected(playerId)}
                  />
                );
              })}
            </tbody>
          </table>

          {/* Add some padding at the bottom for better scrolling */}
          <div className="h-6" />
        </div>
      )}
    </div>
  );
};
