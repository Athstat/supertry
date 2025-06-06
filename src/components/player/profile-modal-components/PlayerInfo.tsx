import React from 'react';
import { formatPosition } from '../../../utils/athleteUtils';
import FormIndicator from '../../shared/FormIndicator';

interface PlayerInfoProps {
  player: any;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {

  return (
    <>
      <div className=" z-50 sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-6 py-4 h-full bg-white dark:bg-slate-800/60 border-gray-200 dark:border-gray-700">

          <div className='flex flex-row items-center gap-2' >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{player.player_name}</h2>
            {player.form && <FormIndicator className='w-5 h-5' form={player.form} />}
          </div>

          <p className="text-gray-600 dark:text-gray-400">{formatPosition(player.position ?? "")}</p>

        </div>
      </div>
    </>
  );
};

export default PlayerInfo;
