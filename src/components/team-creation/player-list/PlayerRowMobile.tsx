import React, { useState } from "react";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { Player } from "../../../types/player";
import { User, CheckCircle, Plus, Loader2 } from "lucide-react";
import {
  calculateAttackRating,
  calculateDefenseRating,
  calculateKickingRating,
} from "../../../utils/playerRatings";
import { motion } from "framer-motion";

interface PlayerRowMobileProps {
  player: RugbyPlayer;
  onSelectPlayer: (player: Player) => void;
  positionName: string;
  createPlayerFromRugbyPlayer: (
    rugbyPlayer: RugbyPlayer,
    positionName: string
  ) => Player;
  isSelected: boolean;
}

export const PlayerRowMobile: React.FC<PlayerRowMobileProps> = ({
  player,
  onSelectPlayer,
  positionName,
  createPlayerFromRugbyPlayer,
  isSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Calculate player ratings
  const attackRating = calculateAttackRating(player);
  const defenseRating = calculateDefenseRating(player);
  const kickingRating = calculateKickingRating(player);

  // Convert rating (0-100) to stars (0-5)
  const ratingToStars = (rating: number): number => {
    return Math.min(5, Math.max(0, Math.round((rating / 100) * 5)));
  };

  // Render stars (0-5)
  const renderStars = (rating: number) => {
    const count = ratingToStars(rating);
    return (
      <div className="flex items-center justify-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`
              block w-1.5 h-1.5 rounded-full 
              ${i < count ? "bg-yellow-400" : "bg-gray-300 dark:bg-gray-600"}
            `}
          />
        ))}
      </div>
    );
  };

  // Handle adding a player
  const handleAddPlayer = async () => {
    if (isSelected || isLoading) return;

    setIsLoading(true);

    try {
      // Create a Player object from RugbyPlayer
      const newPlayer = createPlayerFromRugbyPlayer(player, positionName);

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Add the player
      onSelectPlayer(newPlayer);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <>
      {/* First row: Player info and add button */}
      <tr className="border-b dark:border-gray-800 group">
        <td rowSpan={2} className="p-2 w-12 h-24 align-middle">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            {player.image_url ? (
              <img
                src={player.image_url}
                alt={player.player_name || "Player"}
                className="w-full h-full object-cover object-top scale-[1.2] origin-top pt-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={18} className="text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
        </td>
        <td colSpan={5} className="px-2 py-1.5">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {player.player_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {player.team_name}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddPlayer();
              }}
              className={`
                h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center 
                transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50
                ${
                  isSelected
                    ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-800/40 text-primary-600 dark:text-primary-400"
                }
              `}
              disabled={isSelected || isLoading}
              aria-label={isSelected ? "Added to team" : "Add to team"}
              title={isSelected ? "Added to team" : "Add to team"}
              tabIndex={0}
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={16} />
                </motion.span>
              ) : isSelected ? (
                <CheckCircle size={16} strokeWidth={2.5} />
              ) : (
                <Plus size={16} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Second row: Stats */}
      <tr className="border-b dark:border-gray-800 bg-gray-50/50 dark:bg-dark-800/30 group-hover:bg-gray-100 dark:group-hover:bg-dark-800/50">
        <td className="px-2 py-1.5 text-center">
          <div className="text-xs font-medium">{player.price || 0}</div>
        </td>
        <td className="px-2 py-1.5 text-center">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-semibold">
            {player.power_rank_rating || 0}
          </div>
        </td>
        <td className="px-2 py-1.5">{renderStars(attackRating)}</td>
        <td className="px-2 py-1.5">{renderStars(defenseRating)}</td>
        <td className="px-2 py-1.5">{renderStars(kickingRating)}</td>
      </tr>
    </>
  );
};
