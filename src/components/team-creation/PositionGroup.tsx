import React from "react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";
import { User, X, Plus } from "lucide-react";

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
    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">{name}</h3>
      <div className="grid gap-3">
        {positions.map((position) => {
          const player = selectedPlayers[position.id];

          if (player) {
            return (
              <div
                key={position.id}
                className="relative bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden flex items-center justify-center">
                      {player.image_url ? (
                        <img
                          src={player.image_url}
                          alt={player.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                          }}
                        />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {player.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {player.team}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {player.price || player.points}pts
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemovePlayer(position.id)}
                  className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            );
          }

          return (
            <button
              key={position.id}
              onClick={() => onPositionClick(position)}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <Plus size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Add {position.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a player
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
