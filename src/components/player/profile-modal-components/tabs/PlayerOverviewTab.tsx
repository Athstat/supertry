import { calculateAge } from '../../../../utils/playerUtils';
import PlayerIconsCard from '../PlayerIconsCard';
import Experimental from '../../../shared/ab_testing/Experimental';
import { format } from 'date-fns';
import { IProAthlete } from '../../../../types/athletes';
import { Coins } from 'lucide-react';
import { isNumeric } from '../../../../utils/stringUtils';
import CoachScrummyPlayerReport from '../CoachScrummyPlayerReport';
import { usePlayerData } from '../../../../providers/PlayerDataProvider';
import PlayerTeamFormCard from '../PlayerTeamForm';
import PlayerPercentageSelectedCard from '../PlayerPercentageSelectedCard';
import PlayerPriceHistoryCard from '../PlayerPriceHistoryCard';
import PlayerPointsHistoryCard from '../PlayerPointsHistoryCard';
import RoundedCard from '../../../shared/RoundedCard';
import SecondaryText from '../../../shared/SecondaryText';
import { getCountryEmojiFlag } from '../../../../utils/svrUtils';
import FormIndicator from '../../../shared/FormIndicator';

type Props = {
  player: IProAthlete;
};

// Converts centimeters to feet and inches string, e.g., 170 -> 5'7"
function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${feet}'${inches}"`;
}

// Converts kilograms to pounds string, rounded to nearest pound
function kgToLbs(kg: number): string {
  const lbs = Math.round(kg * 2.2046226218);
  return `${lbs} lbs`;
}

/** Renders a player profile overview tab */
export default function PlayerOverviewTab({ player }: Props) {

  const { currentSeason } = usePlayerData();
  const nationalityIsValid = player.nationality && !isNumeric(player.nationality ?? '');

  const countryFlag = getCountryEmojiFlag(player.nationality);
  const dob = player.date_of_birth ? new Date(player.date_of_birth) : undefined;

  return (
    <div className="flex flex-col gap-6 pb-6">

      {/* <PlayerTeamCard 
        player={player}
      /> */}

      {/* TIER 1: Info Cluster */}
      <RoundedCard className='p-4' >
        <div className='grid grid-cols-3 gap-4' >

          {nationalityIsValid && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >Nationality</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <p>{countryFlag}</p>
              <p className='text-sm font-semibold' >{player.nationality}</p>
            </div>
          </div>}

          {dob && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >{format(dob, "d MMM yyyy")}</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <p className='text-sm font-semibold' >{calculateAge(dob)} yrs</p>
            </div>
          </div>}

          {player.height && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >Height</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <p className='text-sm font-semibold' >{player.height} cm ({cmToFeetInches(player.height)})</p>
            </div>
          </div>}

          {player.weight && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >Weight</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <p className='text-sm font-semibold' >{player.weight} kg ({kgToLbs(player.weight)})</p>
            </div>
          </div>}

          {(player.gender === "F") && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >Gender</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <p className='text-sm font-semibold' >{player.gender}</p>
            </div>
          </div>}

          {player.price && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >Price</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <p className='text-sm font-semibold' >{player.price}</p>
              <Coins className='w-4 h-4 text-yellow-500' />
            </div>
          </div>}

          {player.form && <div className='flex flex-col items-center gap-1' >
            <SecondaryText className='text-xs text-center' >Form</SecondaryText>
            <div className='flex flex-row items-center gap-1' >
              <FormIndicator form={player.form} />
            </div>
          </div>}

        </div>
      </RoundedCard>

      <CoachScrummyPlayerReport player={player} />

      {currentSeason && (
        <Experimental>
          <PlayerIconsCard player={player} season={currentSeason} />
        </Experimental>
      )}

      <PlayerTeamFormCard
        player={player}
      />


      {currentSeason && <PlayerPointsHistoryCard
        player={player}
        season={currentSeason}
      />}


      {currentSeason && <PlayerPercentageSelectedCard
        player={player}
        season={currentSeason}
      />}

      <PlayerPriceHistoryCard
        player={player}
      />

      {/* Season Statistics */}
      {/* <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Season Statistics
        </h3>

        {sortedSeasons.length === 0 && (
          <NoContentCard message={`Career stats for ${player.player_name} are not available`} />
        )}

        {sortedSeasons.length > 0 && (
          <div className="flex flex-col gap-4">
            {sortedSeasons.map(s => {
              return <PlayerSeasonStatsCard player={player} season={s} key={s.id} hideTitle />;
            })}
          </div>
        )}
      </div> */}


    </div>
  );
}
