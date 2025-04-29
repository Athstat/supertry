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
import { StarRating } from "./StarRating";

interface PlayerRowMobileProps {
  player: RugbyPlayer;
  onSelectPlayer: (player: Player) => void;
  onViewDetails: (player: RugbyPlayer) => void;
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
  onViewDetails,
  positionName,
  createPlayerFromRugbyPlayer,
  isSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Calculate player ratings
  const attackRating = calculateAttackRating(player);
  const defenseRating = calculateDefenseRating(player);
  const kickingRating = calculateKickingRating(player);

  // Use the StarRating component for star ratings
  const renderStars = (rating: number) => {
    return <StarRating rating={rating} size={10} className="max-w-full" />;
  };

  // Handle adding a player (when tapping the add button)
  const handleAddPlayer = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details modal

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

  // Handle clicking on player info (open details modal)
  const handlePlayerInfoClick = () => {
    onViewDetails(player);
  };

  return (
    <>
      {/* Player row with info and add button */}
      <tr
        className="group cursor-pointer hover:bg-gray-50/70 dark:hover:bg-gray-800/20 transition-colors"
        onClick={handlePlayerInfoClick}
      >
        {/* Player image - spans both rows with 4:5 portrait ratio */}
        <td rowSpan={2} className="py-2 pl-2 pr-0 w-[3.5rem] align-middle">
          <div className="relative w-14 h-[70px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
            {player.image_url ? (
              <img
                src={player.image_url}
                alt={player.player_name || "Player"}
                className="w-full h-full object-cover object-top scale-[1.3] origin-top pt-2"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
        </td>

        {/* Player info and add button - reduce left padding */}
        <td colSpan={5} className="pl-1 pr-2 py-2.5 border-b-0">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0 active:opacity-70">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                {player.player_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                {player.team_name}
              </div>
            </div>

            <motion.button
              onClick={handleAddPlayer}
              whileTap={{ scale: 0.9 }}
              className={`
                ml-4 h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center 
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
            </motion.button>
          </div>
        </td>
      </tr>

      {/* Stats row - with proper spacing and alignment */}
      <tr
        className="group-hover:bg-gray-50/80 dark:group-hover:bg-gray-800/20 cursor-pointer transition-colors"
        onClick={handlePlayerInfoClick}
      >
        {/* Stats cells with appropriate alignment and spacing */}
        <td className="pl-1 py-2 text-center">
          <div className="text-xs font-medium">{player.price || 0}</div>
        </td>
        <td className="px-1 py-2 text-center">
          <div className="inline-flex items-center justify-center mx-auto w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-semibold">
            {player.power_rank_rating || 0}
          </div>
        </td>
        <td className="py-2">
          <div className="flex justify-center items-center">
            {renderStars(attackRating)}
          </div>
        </td>
        <td className="py-2">
          <div className="flex justify-center items-center">
            {renderStars(defenseRating)}
          </div>
        </td>
        <td className="py-2">
          <div className="flex justify-center items-center">
            {renderStars(kickingRating)}
          </div>
        </td>
      </tr>
    </>
  );
};
