import React, { useState } from "react";
import { X, ArrowLeftRight } from "lucide-react";
import { Player } from "../../types/team";

interface PlayerSubstitutionModalProps {
  player: Player;
  onClose: () => void;
  onSubstitute: (oldPlayer: Player, newPlayer: Player) => void;
}

export function PlayerSubstitutionModal({
  player,
  onClose,
  onSubstitute,
}: PlayerSubstitutionModalProps) {
  const [selectedSubstitute, setSelectedSubstitute] = useState<Player | null>(null);

  // Mock data - replace with actual available substitutes
  const availableSubstitutes: Player[] = [
    // Add substitute players...
  ];

  const handleSubstitute = () => {
    if (selectedSubstitute) {
      onSubstitute(player, selectedSubstitute);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200 dark:border-dark-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold dark:text-gray-100">Player Substitution</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Current Player */}
          <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold dark:text-gray-100">{player.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{player.position}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{player.team}</span>
              <span className="text-indigo-600 dark:text-indigo-400">{player.points} pts</span>
            </div>
          </div>

          <div className="flex justify-center my-4">
            <ArrowLeftRight size={24} className="text-gray-400 dark:text-gray-500" />
          </div>

          {/* Available Substitutes */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableSubstitutes.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubstitute(sub)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedSubstitute?.id === sub.id
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500"
                    : "bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold dark:text-gray-100">{sub.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{sub.position}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{sub.team}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{sub.points} pts</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-b-xl">
          <button
            onClick={handleSubstitute}
            disabled={!selectedSubstitute}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Substitution
          </button>
        </div>
      </div>
    </div>
  );
} 