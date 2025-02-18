import React from "react";
import { Search, X } from "lucide-react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";
import { availablePlayers } from "../../data/availablePlayers";

interface PlayerListModalProps {
  position: Position;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
}

export function PlayerListModal({
  position,
  searchQuery,
  setSearchQuery,
  onClose,
  onSelectPlayer,
}: PlayerListModalProps) {
  const filteredPlayers = availablePlayers.filter(
    (player) =>
      player.position === position.name &&
      (player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-950/90 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden ">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-100">
              Select {position.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 bg-gray-50 dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className="w-full p-4 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-4 border-b border-gray-100 dark:border-dark-700 last:border-0"
            >
              <img
                src={player.image}
                alt={player.name}
                className="w-12 h-12 object-cover rounded-full bg-gray-100 dark:bg-dark-700"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start">
                    <div className="font-semibold dark:text-gray-100">
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {player.team}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold dark:text-gray-200">
                      PR: {player.pr}
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-500">
                      {player.cost} pts
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
