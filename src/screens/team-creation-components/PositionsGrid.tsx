import React from 'react';
import PositionCard from '../../components/team-creation/PositionCard';
import { TeamCreationPositionSlot } from '../../types/position';
import { RugbyPlayer } from '../../types/rugbyPlayer';

interface PositionsGridProps {
  positions: TeamCreationPositionSlot[];
  selectedPosition: TeamCreationPositionSlot | null;
  onPositionSelect: (position: TeamCreationPositionSlot) => void;
  onPlayerRemove: (positionId: string) => void;
  selectedPlayers: Record<string, RugbyPlayer>;
  captainId?: string | null;
  setCaptainId?: (id: string | null) => void;
}

export const PositionsGrid: React.FC<PositionsGridProps> = ({
  positions,
  selectedPosition,
  onPositionSelect,
  onPlayerRemove,
  selectedPlayers,
  captainId,
  setCaptainId
}) => {

  return (

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
      {positions.map(position => {

        const slotPlayer = selectedPlayers[position.id];
        position.player = slotPlayer;

        return (
          <PositionCard
            key={position.id}
            position={position}
            selected={selectedPosition?.id === position.id}
            onPress={() => onPositionSelect(position)}
            onRemove={onPlayerRemove}
            captainId={captainId}
            setCaptainId={setCaptainId}
          />
        )
      })}
    </div>
  );
};

export default PositionsGrid;
