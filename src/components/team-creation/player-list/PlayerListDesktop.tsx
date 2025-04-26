import React from "react";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { Player } from "../../../types/player";
import { PlayerListView } from "./PlayerListView";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";

interface PlayerListDesktopProps {
  filteredPlayers: RugbyPlayer[];
  onSelectPlayer: (player: Player) => void;
  positionName: string;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: string;
  setSortDirection: (direction: string) => void;
  selectedPlayers?: Record<string, Player>;
  loading?: boolean;
}

export const PlayerListDesktop: React.FC<PlayerListDesktopProps> = ({
  filteredPlayers,
  onSelectPlayer,
  positionName,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  selectedPlayers = {},
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (filteredPlayers.length === 0) {
    return <EmptyState />;
  }

  // Simply pass through to the original PlayerListView component
  return (
    <PlayerListView
      filteredPlayers={filteredPlayers}
      onSelectPlayer={onSelectPlayer}
      positionName={positionName}
      sortField={sortField}
      setSortField={setSortField}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      selectedPlayers={selectedPlayers}
    />
  );
};
