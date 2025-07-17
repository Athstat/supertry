import React from 'react';
import { formatDate } from '../utils';
import { calculateAge } from '../../../../utils/playerUtils';
import { IProAthlete } from '../../../../types/athletes';

interface OverviewTabProps {
  player: IProAthlete;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ player }) => {
  return (
    <div className="space-y-4">

      <div className='rounded-xl bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-700' >
        <div className='p-3 border-b dark:border-slate-700' >
          <p className='text-lg dark:text-white font-medium' >About</p>
        </div>

        <div className='p-3' >
          <div className="grid grid-cols-2 gap-4">
            <div className="text-gray-500 dark:text-gray-400">Name</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">{player.player_name}</div>

            <div className="text-gray-500 dark:text-gray-400">Team</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">{player.team.athstat_name}</div>

            <div className="text-gray-500 dark:text-gray-400">Date of Birth</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">{player.date_of_birth !== undefined ? formatDate(player.date_of_birth) : "-"}</div>

            <div className="text-gray-500 dark:text-gray-400">Age</div>
            <div className="font-medium text-gray-700 dark:text-gray-300">{player.date_of_birth ? calculateAge(player.date_of_birth) : "-"}</div>


            {player.height && (
              <>
                <div className="text-gray-500 dark:text-gray-400">Height</div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {player.height} cm ({Math.floor(player.height / 30.48)}'{Math.round((player.height / 2.54) % 12)}")
                </div>
              </>
            )}

            {player.weight && (
              <>
                <div className="text-gray-500 dark:text-gray-400">Weight</div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {player.weight} kg ({Math.round(player.weight * 2.20462)} lbs)
                </div>
              </>
            )}

            {player.birth_country && (
              <>
                <div className="text-gray-500 dark:text-gray-400">Country of Birth</div>
                <div className="font-medium text-gray-700 dark:text-gray-300">{player.birth_country}</div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OverviewTab;
