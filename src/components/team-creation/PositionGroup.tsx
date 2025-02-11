import React from "react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";
import { PlayerCard } from "./PlayerCard";
import { EmptyPositionCard } from "./EmptyPositionCard";

interface PositionGroupProps {
  name: string;
  positions: Position[];
  selectedPlayers: Record<string, Player>;
  onPositionClick: (position: Position) => void;
  onRemovePlayer: (positionId: string) => void;
}

export function PositionGroup({
  name,
  positions,
  selectedPlayers,
  onPositionClick,
  onRemovePlayer,
}: PositionGroupProps) {
  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4 ">
      <h2 className="text-lg font-semibold mb-3 dark:text-gray-100">{name}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {positions.map((position) => {
          const player = selectedPlayers[position.id];
          return (
            <div key={position.id} className="relative">
              {player ? (
                <PlayerCard
                  player={player}
                  position={position}
                  onRemove={() => onRemovePlayer(position.id)}
                />
              ) : (
                <EmptyPositionCard
                  position={position}
                  onClick={() => onPositionClick(position)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
