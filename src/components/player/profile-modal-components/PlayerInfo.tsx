import React from 'react';
import { useSticky } from '../../../hooks/useSticky';

interface PlayerInfoProps {
  player: any;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {

  return (
    <>
      <div className="px-6 py-4 sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{player.player_name}</h2>
        <p className="text-gray-600 dark:text-gray-400">{player.position}</p>
      </div>
    </>
  );
};

export default PlayerInfo;
