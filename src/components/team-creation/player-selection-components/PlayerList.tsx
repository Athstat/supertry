import React from 'react';
import { usePlayerProfile } from '../../../hooks/usePlayerProfile';
import renderStatDots from './renderStatDots';
import { convertToPlayer } from './PlayerConverter';
import { Player } from '../../../types/player';
import { Position } from '../../../types/position';
import FormIndicator, { AvailabilityIndicator } from '../../shared/FormIndicator';
import { RugbyPlayer } from '../../../types/rugbyPlayer';

interface PlayerListProps {
  players: RugbyPlayer[];
  isLoading: boolean;
  selectedPosition: Position;
  handlePlayerSelect: (player: Player) => void;
  onClose: () => void;
  roundId?: number;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  isLoading,
  selectedPosition,
  handlePlayerSelect,
  onClose,
  roundId
}) => {
  // Get the player profile hook
  const { showPlayerProfile } = usePlayerProfile();

  // Function to handle viewing player profile
  const handleViewPlayerProfile = (player: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
    showPlayerProfile(player, { roundId: roundId?.toString() });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-300">Loading players...</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-10 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium mb-2 dark:text-gray-300">No players found matching your criteria.</p>
        <p className="text-sm text-center">Try adjusting your search or filters, or check that there are players available for this position.</p>
      </div>
    );
  }

  return (
    <>
      {players.map(player => (
        <div
          key={player.tracking_id || player.id || Math.random()}
          onClick={() => {
            handlePlayerSelect(convertToPlayer(player, selectedPosition));
            onClose(); // Close the modal after selection
          }}
          className="flex items-center px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition"
        >
          {/* Player image/initials - hidden on mobile */}
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-300 items-center justify-center mr-3">
            {player.image_url ? (
              <img
                src={player.image_url}
                alt={player.player_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-semibold">
                {(player.player_name?.charAt(0) || '?')}
              </span>
            )}
          </div>

          {/* Player info */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-start sm:items-center justify-between">
              <p className="font-semibold text-sm leading-tight break-words sm:truncate dark:text-gray-100 max-w-[150px] sm:max-w-none">{player.player_name}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{player.team_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{player.position || selectedPosition.name}</p>
            <button
              onClick={(e) => handleViewPlayerProfile(player, e)}
              className="mt-1 text-blue-500 dark:text-blue-400 hover:underline transition-colors text-xs flex items-center"
              aria-label="More player information"
            >
              <span className="mr-1">→</span>
              <span>More Info</span>
            </button>
          </div>

          {/* Price - always visible */}

          {/* {player.form && <div className="w-fit lg:w-12 flex flex-row items-center justify-end">
            <FormIndicator form={player.form} />
          </div>} */}

          {player.available !== undefined && <div className="w-fit lg:w-12 flex flex-row items-center justify-end">
            <AvailabilityIndicator availability={player.available} />
          </div>}


          <div className="w-12 text-center">
            <p className="font-bold text-sm dark:text-gray-200">{player.price}</p>
          </div>

          {/* Rating */}
          <div className="w-12 text-center">
            <p className="text-sm dark:text-gray-200">{(player.power_rank_rating || 0).toFixed(1)}</p>
          </div>

          {/* Attack stat */}
          <div className="w-16 flex justify-center px-2">
            {renderStatDots(player.ball_carrying || 0, 'bg-red-500')}
          </div>

          {/* Defense stat */}
          <div className="w-16 flex justify-center px-2">
            {renderStatDots(player.tackling || 0, 'bg-blue-500')}
          </div>

          {/* Kicking stat */}
          <div className="w-16 flex justify-center px-2">
            {renderStatDots(player.points_kicking || 0, 'bg-green-500')}
          </div>
        </div>
      ))}
    </>
  );
};

export default PlayerList;
