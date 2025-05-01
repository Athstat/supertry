import React from 'react';
import PositionCard from '../../components/team-creation/PositionCard';
import { Position } from '../../types/position';

interface PositionsGridProps {
  positions: Position[];
  selectedPosition: Position | null;
  onPositionSelect: (position: Position) => void;
  onPlayerRemove: (positionId: string) => void;
}

export const PositionsGrid: React.FC<PositionsGridProps> = ({
  positions,
  selectedPosition,
  onPositionSelect,
  onPlayerRemove
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
      {positions.map(position => (
        <PositionCard
          key={position.id}
          position={position}
          selected={selectedPosition?.id === position.id}
          onPress={() => onPositionSelect(position)}
          onRemove={onPlayerRemove}
        />
      ))}
    </div>
  );
};

export default PositionsGrid;
