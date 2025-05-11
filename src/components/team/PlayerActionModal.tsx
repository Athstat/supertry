import { X, Trophy, Users } from "lucide-react";
import { Player } from "../../types/team";
import { motion } from "framer-motion";
import { formatPosition } from "../../utils/athleteUtils";

interface PlayerActionModalProps {
  player: Player;
  onClose: () => void;
  onViewStats: (player: Player) => void;
  onSwapPlayer: (player: Player) => void;
}

export function PlayerActionModal({
  player,
  onClose,
  onViewStats,
  onSwapPlayer,
}: PlayerActionModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-sm shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold dark:text-gray-100">
              Player Actions
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Player Info */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-dark-800/40 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary-300 dark:border-primary-700">
              {player.image ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  {player.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-lg dark:text-gray-100">
                  {player.name}
                </span>
                <span className="text-sm font-bold px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded-full text-gray-800 dark:text-gray-300">
                  {formatPosition(player.position ?? "")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {player.team}
                </span>
                <span className="text-primary-700 dark:text-primary-500 font-bold flex items-center">
                  {player.points} pts
                </span>
              </div>
              {player.is_super_sub && (
                <div className="mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Super Sub - Can play any position
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onViewStats(player)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-dark-800/40 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Trophy
                size={24}
                className="text-primary-600 dark:text-primary-400"
              />
              <span className="font-medium">View Stats</span>
            </button>
            <button
              onClick={() => onSwapPlayer(player)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-dark-800/40 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Users
                size={24}
                className="text-primary-600 dark:text-primary-400"
              />
              <span className="font-medium">Swap Player</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
