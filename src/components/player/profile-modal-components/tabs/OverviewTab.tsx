import React from 'react';
import { calculateAge } from '../../../../utils/playerUtils';
import { IProAthlete } from '../../../../types/athletes';
import PlayerIconsCard from '../PlayerIconsCard';
import SecondaryText from '../../../shared/SecondaryText';
import Experimental from '../../../shared/ab_testing/Experimental';

interface OverviewTabProps {
  player: IProAthlete;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ player }) => {
  return (
    <div className="space-y-4 px-1 pb-20">

      <div className='rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-700' >
        <div className="flex flex-col gap-2.5">

          <div >
            <SecondaryText>Name</SecondaryText>
            <p className="font-medium text-gray-700 dark:text-gray-300">{player.player_name}</p>
          </div>

          <div >
            <SecondaryText>Team</SecondaryText>
            <p className="font-medium text-gray-700 dark:text-gray-300">{player.team.athstat_name}</p>
          </div>

          <div >
            <SecondaryText>Age</SecondaryText>
            <p className="font-medium text-gray-700 dark:text-gray-300">{player.date_of_birth ? calculateAge(player.date_of_birth) : "-"}</p>
          </div>

          {player.height && <div >
            <SecondaryText>Height</SecondaryText>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {player.height} cm ( {Math.floor(player.height / 30.48)}'{Math.round((player.height / 2.54) % 12)} ft )
            </p>
          </div>}

          {player.weight && <div >
            <SecondaryText>Height</SecondaryText>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {player.weight} kg ( {Math.round(player.weight * 2.20462)} lbs )
            </p>
          </div>}

          {player.birth_country && (
            <>
              <div className="text-gray-500 dark:text-gray-400">Country of Birth</div>
              <div className="font-medium text-gray-700 dark:text-gray-300">{player.birth_country}</div>
            </>
          )}

        </div>
      </div>
      
      <Experimental>
        <PlayerIconsCard player={player} />
      </Experimental>

    </div>
  );
};

export default OverviewTab;
