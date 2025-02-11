import React from "react";
import { X } from "lucide-react";
import { Player } from "../../types/player";

interface PlayerDetailsModalProps {
  player: Player;
  onClose: () => void;
  onAdd: () => void;
}

export function PlayerDetailsModal({
  player,
  onClose,
  onAdd,
}: PlayerDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-lg overflow-hidden ">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold dark:text-gray-100">
              Player Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <img
              src={player.image}
              alt={player.name}
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <h3 className="text-xl font-bold dark:text-gray-100">
                {player.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{player.team}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {player.position}
              </p>
              <div className="mt-2">
                <span className="font-semibold text-green-600 dark:text-green-500">
                  {player.cost} points
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-dark-800/40 p-3 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Performance Rating
              </div>
              <div className="text-lg font-bold dark:text-gray-100">
                {player.pr}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 p-3 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Season Points
              </div>
              <div className="text-lg font-bold dark:text-gray-100">
                {player.points}
              </div>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Add to Team
          </button>
        </div>
      </div>
    </div>
  );
}
