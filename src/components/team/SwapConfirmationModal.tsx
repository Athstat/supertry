import { X, Users } from "lucide-react";
import { motion } from "framer-motion";
import { formatPosition } from "../../utils/athleteUtils";
import { useAtomValue } from "jotai";
import { playerToSwapInAtom, playerToSwapOutAtom } from "../../state/playerSwap.atoms";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import { twMerge } from "tailwind-merge";

interface SwapConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isUpdating?: boolean
}

export function SwapConfirmationModal({
  onClose,
  onConfirm,
  isUpdating
}: SwapConfirmationModalProps) {

  const newPlayer = useAtomValue(playerToSwapInAtom);
  const currentPlayer = useAtomValue(playerToSwapOutAtom);

  if (!newPlayer || !currentPlayer) return;

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
              Confirm Player Swap
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mb-5 flex items-center gap-3">
            <Users
              size={20}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0"
            />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              This action will replace{" "}
              <span className="font-semibold">{currentPlayer.player_name}</span> with{" "}
              <span className="font-semibold">{newPlayer.player_name}</span> in your
              team lineup.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Current Player */}
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3 border border-gray-200 dark:border-gray-700/30">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium text-center">
                Current Player
              </h4>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center overflow-hidden border-2 border-red-300 dark:border-red-700 mb-2">
                  {currentPlayer.image_url ? (
                    <img
                      src={currentPlayer.image_url}
                      alt={currentPlayer.player_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                      {currentPlayer.player_name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-sm dark:text-gray-100 text-center">
                  {currentPlayer.player_name}
                </span>
                {currentPlayer.position && <span className="text-xs text-gray-600 dark:text-gray-400 text-center mb-1">
                  {formatPosition(currentPlayer.position)}
                </span>}
                <span className="text-xs font-medium text-primary-700 dark:text-primary-500 text-center flex items-center justify-center gap-1">
                  <svg viewBox="0 0 24 24" fill="#FFD700" className="w-3 h-3">
                    <circle cx="12" cy="12" r="10" fill="#FFD700" />
                  </svg>
                  {currentPlayer.price}
                </span>
              </div>
            </div>

            {/* New Player */}
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3 border border-gray-200 dark:border-gray-700/30">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-medium text-center">
                New Player
              </h4>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center overflow-hidden border-2 border-green-300 dark:border-green-700 mb-2">
                  {newPlayer.image_url ? (
                    <img
                      src={newPlayer.image_url}
                      alt={newPlayer.player_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                      {newPlayer.player_name?.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-sm dark:text-gray-100 text-center">
                  {newPlayer.player_name}
                </span>
                {newPlayer.position && <span className="text-xs text-gray-600 dark:text-gray-400 text-center mb-1">
                  {formatPosition(newPlayer.position)}
                </span>}
                <span className="text-xs font-medium text-primary-700 dark:text-primary-500 text-center flex items-center justify-center gap-1">
                  <svg viewBox="0 0 24 24" fill="#FFD700" className="w-3 h-3">
                    <circle cx="12" cy="12" r="10" fill="#FFD700" />
                  </svg>
                  {newPlayer.price}
                </span>
              </div>
            </div>
          </div>

          {/* Price Change */}
          {newPlayer.price && currentPlayer.purchase_price && <div className="flex items-center justify-center mb-6">
            <div className="px-4 py-2 bg-gray-100 dark:bg-dark-800 rounded-full">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Change:
                </span>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    newPlayer.price > currentPlayer.purchase_price
                      ? "text-green-600 dark:text-green-400"
                      : newPlayer.price < currentPlayer.purchase_price
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {newPlayer.price > currentPlayer.purchase_price && "+"}
                  {newPlayer.price - currentPlayer.purchase_price}
                  <svg viewBox="0 0 24 24" fill="#FFD700" className="w-3 h-3">
                    <circle cx="12" cy="12" r="10" fill="#FFD700" />
                  </svg>
                </span>
              </div>
            </div>
          </div>}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isUpdating}
              className={twMerge(
                "flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center gap-2",
                isUpdating && "opacity-50 animate-pulse"
              )}
            >
              <X size={18} className="transform rotate-45" />
              <span>Confirm Swap</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
