
import { calculateAge } from '../../../../utils/playerUtils';
import PlayerIconsCard from '../PlayerIconsCard';
import Experimental from '../../../shared/ab_testing/Experimental';
import { format } from 'date-fns';
import PlayerInfoCard from '../PlayerInfoCard';
import PlayerTeamCard from '../PlayerTeamCard';
import CoachScrummyPlayerReport from '../CoachScrummyPlayerReport';
import { IProAthlete } from '../../../../types/athletes';

type Props = {
  player: IProAthlete;
}

/** Renders a player profile overview tab */
export default function PlayerOverviewTab({ player }: Props) {
  
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

     {/* <PlayerIconsRow 
      player={player}
     /> */}

     <CoachScrummyPlayerReport 
      player={player}
     />

      <Experimental>
        <PlayerIconsCard player={player} />
      </Experimental>

    </div>
  );
};
