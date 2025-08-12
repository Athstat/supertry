
import { calculateAge } from '../../../../utils/playerUtils';
import PlayerIconsCard from '../PlayerIconsCard';
import Experimental from '../../../shared/ab_testing/Experimental';
import { format } from 'date-fns';
import PlayerInfoCard from '../PlayerInfoCard';
import PlayerTeamCard from '../PlayerTeamCard';
import CoachScrummyPlayerReport from '../CoachScrummyPlayerReport';
import { IProAthlete } from '../../../../types/athletes';
import { usePlayerData } from '../../provider/PlayerDataProvider';
import PlayerSeasonStatsCard from '../../PlayerSeasonStatsCard';
import PlayerIconsRow from '../../../players/compare/PlayerIconsRow';
import { Dumbbell } from 'lucide-react';
import SecondaryText from '../../../shared/SecondaryText';

type Props = {
  player: IProAthlete;
}

/** Renders a player profile overview tab */
export default function PlayerOverviewTab({ player }: Props) {

  const { currentSeason } = usePlayerData();

  return (
    <div className="space-y-4 px-1 ">

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

      {player.team && <PlayerTeamCard player={player} />}


      <div className='flex flex-col gap-2' >
        <SecondaryText className='flex flex-row items-center gap-2' >
          <Dumbbell className='w-4 h-4' />
          <p>Physique</p>
        </SecondaryText>

        <div className='flex flex-row items-center gap-2' >

          {player.height && <PlayerInfoCard
            value={`${player.height} cm`}
            label={'Height'}
          />}

          {player.weight && <PlayerInfoCard
            value={`${player.weight} kg`}
            label={'Weight'}
          />}
        </div>

      </div>

      {/* <PlayerIconsRow 
      player={player}
     /> */}

      {currentSeason && (
        <PlayerIconsRow
          player={player}
          season={currentSeason}
          size='sm'
        />
      )}

      <CoachScrummyPlayerReport
        player={player}
      />

      {currentSeason && (
        <PlayerSeasonStatsCard
          player={player}
          season={currentSeason}
        />
      )}


      {currentSeason && <Experimental>
        <PlayerIconsCard
          player={player}
          season={currentSeason}
        />
      </Experimental>}

    </div>
  );
};
