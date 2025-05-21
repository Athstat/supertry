import React from "react";
import { usePlayerProfile } from "../../../hooks/usePlayerProfile";
import { Player } from "../../../types/player";
import { Position } from "../../../types/position";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { AvailableTeam } from "./useAvailableTeams";
import PlayerListItem from "./PlayerListItem";

interface PlayerListProps {
  players: RugbyPlayer[];
  isLoading: boolean;
  selectedPosition: Position;
  handlePlayerSelect: (player: Player) => void;
  onClose: () => void;
  roundId?: number;
  availableTeams: AvailableTeam[]
  remainingBudget: number
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  isLoading,
  selectedPosition,
  handlePlayerSelect,
  onClose,
  roundId,
  availableTeams,
  remainingBudget
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
        <p className="ml-3 text-gray-600 dark:text-gray-300">
          Loading players...
        </p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-10 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium mb-2 dark:text-gray-300">
          No players found matching your criteria.
        </p>
        <p className="text-sm text-center">
          Try adjusting your search or filters, or check that there are players
          available for this position.
        </p>
      </div>
    );
  }

  const teamIds = availableTeams.map(t => t.id);
  
  /** Bias is used to sort affordable players first
   * and unaffordable players last
   */
  const affordabilityBias = (a: RugbyPlayer) => {
    if (!a.price) return -1;
    if (a.price > remainingBudget)  {
      return 1;
    }

    return 0;
  }
  
  const availablePlayers = players.filter(p => {
    return p.team_id && teamIds.includes(p.team_id);
  }).sort((a, b) => {
    return affordabilityBias(a) - affordabilityBias(b);
  });


  return (
    <>
      {availablePlayers.map((player, index) => (
        <PlayerListItem 
          player={player}
          key={index}
          handlePlayerSelect={handlePlayerSelect}
          handleViewPlayerProfile={handleViewPlayerProfile}
          onClose={onClose}
          selectedPosition={selectedPosition}
          remainingBudget={remainingBudget}
        />
      ))}
    </>
  );
};

export default PlayerList;
