import React, { useState } from "react";
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
  positionName: string;
  selectedPlayers?: Record<string, Player>;
  loading?: boolean;
}

export const PlayerListMobile: React.FC<PlayerListMobileProps> = ({
  filteredPlayers,
  onSelectPlayer,
  positionName,
  selectedPlayers = {},
  loading = false,
}) => {
  // Local sort state
  const [sortField, setSortField] = useState<SortField | null>(
    "power_rank_rating"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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
    <div className="w-full overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : sortedPlayers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-20 shadow-sm">
              <tr>
                {/* Empty cell for player image column */}
                <th className="w-12 bg-white dark:bg-dark-850"></th>

                {/* Stats header cells */}
                <SortableHeader
                  title="COST"
                  sortField="price"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("price")}
                />

                <SortableHeader
                  title="PR"
                  sortField="power_rank_rating"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("power_rank_rating")}
                />

                <SortableHeader
                  title="ATK"
                  sortField="attack"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("attack")}
                />

                <SortableHeader
                  title="DEF"
                  sortField="defense"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("defense")}
                />

                <SortableHeader
                  title="KCK"
                  sortField="kicking"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={() => handleSort("kicking")}
                />
              </tr>
            </thead>

            <tbody>
              {sortedPlayers.map((player) => {
                const playerId = player.tracking_id || player.id || "";

                return (
                  <PlayerRowMobile
                    key={playerId}
                    player={player}
                    onSelectPlayer={onSelectPlayer}
                    positionName={positionName}
                    createPlayerFromRugbyPlayer={createPlayerFromRugbyPlayer}
                    isSelected={isPlayerSelected(playerId)}
                  />
                );
              })}
            </tbody>
          </table>

          {/* Add some padding at the bottom for better scrolling */}
          <div className="h-4" />
        </div>
      )}
    </div>
  );
};
