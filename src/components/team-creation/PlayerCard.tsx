import React from 'react';
import { X } from 'lucide-react';
import { Player } from '../../types/player';
import { Position } from '../../types/position';

interface PlayerCardProps {
  player: Player;
  position: Position;
  onRemove: () => void;
}

export function PlayerCard({ player, position, onRemove }: PlayerCardProps) {
  return (
    <div className="bg-white dark:bg-dark-850 rounded-lg shadow-sm dark:shadow-dark-sm p-3 border-2 border-green-500 dark:border-green-600">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
      >
        <X size={14} />
      </button>
      <div className="w-full h-20 relative">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover rounded absolute inset-0"
        />
      </div>
      <div className="text-sm font-semibold truncate mt-2 dark:text-gray-100">{player.name}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400">{position.name}</div>
      <div className="text-sm font-bold text-green-600 dark:text-green-500 mt-1">{player.cost}pts</div>
    </div>
  );
}