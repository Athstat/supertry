import React from 'react';
import { usePlayerProfile } from '../../../hooks/usePlayerProfile';
import { Position } from '../../../types/position';
import { IProAthlete } from '../../../types/athletes';
import { AvailableTeam } from './useAvailableTeams';
import PlayerListItem from './PlayerListItem';

interface PlayerListProps {
  players: IProAthlete[];
  isLoading: boolean;
  selectedPosition: Position;
  handlePlayerSelect: (player: IProAthlete) => void;
  onClose: () => void;
  roundId?: number;
  availableTeams: AvailableTeam[];
  remainingBudget: number;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  isLoading,
  selectedPosition,
  handlePlayerSelect,
  onClose,
  roundId,
  availableTeams,
  remainingBudget,
}) => {
  // Get the player profile hook
  const { showPlayerProfile } = usePlayerProfile();

  // Function to handle viewing player profile
  const handleViewPlayerProfile = (player: IProAthlete, e: React.MouseEvent) => {
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
        <p className="text-lg font-medium mb-2 dark:text-gray-300">
          No players found matching your criteria.
        </p>
        <p className="text-sm text-center">
          Try adjusting your search or filters, or check that there are players available for this
          position.
        </p>
      </div>
    );
  }

  const teamIds = availableTeams.map(t => t.id);

  // console.log('PlayerList - Available team IDs:', teamIds);
  // console.log(
  //   'PlayerList - Sample player team_ids:',
  //   players.slice(0, 3).map(p => ({ name: p.player_name, team_id: p.team_id }))
  // );

  /** Bias is used to sort affordable players first
   * and unaffordable players last
   */
  const affordabilityBias = (a: IProAthlete) => {
    if (!a.price) return -1;
    if (a.price > remainingBudget) {
      return 1;
    }

    return 0;
  };

  const availablePlayers = players
    .filter(p => {
      const hasTeamId = p.team_id && teamIds.includes(p.team_id);
      if (!hasTeamId && p.player_name === 'Dafydd Hughes') {
        console.log(
          'Dafydd Hughes filtered out - team_id:',
          p.team_id,
          'available teams:',
          teamIds
        );
      }
      return hasTeamId;
    })
    .sort((a, b) => {
      return affordabilityBias(a) - affordabilityBias(b);
    });

  // console.log(
  //   'PlayerList - Filtered players count:',
  //   availablePlayers.length,
  //   'out of',
  //   players.length
  // );

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
