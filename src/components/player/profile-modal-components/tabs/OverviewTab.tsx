import React from 'react';
import { calculateAge } from '../../../../utils/playerUtils';
import { IProAthlete } from '../../../../types/athletes';
import PlayerIconsCard from '../PlayerIconsCard';
import SecondaryText from '../../../shared/SecondaryText';
import Experimental from '../../../shared/ab_testing/Experimental';
import { format } from 'date-fns';
import PlayerInfoCard from '../PlayerInfoCard';
import PlayerTeamCard from '../PlayerTeamCard';

interface OverviewTabProps {
  player: IProAthlete;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ player }) => {
  return (
    <div className="space-y-4 px-1 pb-20">


      <div className='flex flex-row items-center gap-2' >

        {player.date_of_birth && <PlayerInfoCard
          value={`${calculateAge(player.date_of_birth)} Years`}
          label={format(player.date_of_birth, 'dd MMMM yyyy')}
        />}

        {player.date_of_birth && <PlayerInfoCard
          value={`${player.nationality}`}
          label={player.birth_country ? `Born in ${player.birth_country}` : 'Nationality'}
        />}
      </div>

     { player.team && <PlayerTeamCard player={player} />}

      <Experimental>
        <PlayerIconsCard player={player} />
      </Experimental>

    </div>
  );
};

export default OverviewTab;
