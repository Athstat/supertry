import { calculateAge } from '../../../../utils/playerUtils';
import PlayerIconsCard from '../PlayerIconsCard';
import { format } from 'date-fns';
import { IProAthlete } from '../../../../types/athletes';
import { Coins } from 'lucide-react';
import { isNumeric, stripCountryName } from '../../../../utils/stringUtils';
import CoachScrummyPlayerReport from '../CoachScrummyPlayerReport';
import { usePlayerData } from '../../../../providers/PlayerDataProvider';
import PlayerTeamFormCard from '../PlayerTeamForm';
import PlayerPercentageSelectedCard from '../PlayerPercentageSelectedCard';
import PlayerPointsHistoryCard from '../points_history/PlayerPointsHistoryCard';
import SecondaryText from '../../../ui/typography/SecondaryText';
import { getCountryEmojiFlag } from '../../../../utils/svrUtils';
import FormIndicator from '../../FormIndicator';
import PlayerTeamCard from '../PlayerTeamCard';
import Experimental from '../../../ui/ab_testing/Experimental';
import PlayerNextMatchCard from '../PlayerNextMatchCard';
import RoundedCard from '../../../ui/cards/RoundedCard';

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
  const { nationality } = player;
  const nationalityIsValid = nationality && !isNumeric(nationality ?? '');

  const countryFlag = nationalityIsValid ? getCountryEmojiFlag(stripCountryName(nationality)) : undefined;
  const dob = player.date_of_birth ? new Date(player.date_of_birth) : undefined;

  return (
    <div className="flex flex-col gap-6 pb-6">

      <PlayerTeamCard
        player={player}
      />

      {/* TIER 1: Info Cluster */}
      <RoundedCard className='p-4 dark:border-none grid grid-cols-3 gap-4' >

        {nationalityIsValid && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >Nationality</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <p>{countryFlag}</p>
            <p className='text-sm font-medium' >{stripCountryName(nationality)}</p>
          </div>
        </div>}

        {dob && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >{format(dob, "d MMM yyyy")}</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <p className='text-sm font-medium' >{calculateAge(dob)} yrs</p>
          </div>
        </div>}

        {player.height && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >Height</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <p className='text-sm font-medium' >{player.height} cm ({cmToFeetInches(player.height)})</p>
          </div>
        </div>}

        {player.weight && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >Weight</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <p className='text-sm font-medium' >{player.weight} kg ({kgToLbs(player.weight)})</p>
          </div>
        </div>}

        {(player.gender === "F") && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >Gender</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <p className='text-sm font-medium' >{player.gender}</p>
          </div>
        </div>}

        {player.price && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >Price</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <p className='text-sm font-medium' >{player.price}</p>
            <Coins className='w-4 h-4 text-yellow-500' />
          </div>
        </div>}

        {player.form && <div className='flex flex-col items-center gap-1' >
          <SecondaryText className='text-[11px] text-center' >Form</SecondaryText>
          <div className='flex flex-row items-center gap-1' >
            <FormIndicator form={player.form} />
          </div>
        </div>}

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

      <PlayerNextMatchCard
        player={player}
      />

      {currentSeason && <PlayerPercentageSelectedCard
        player={player}
        season={currentSeason}
      />}

      {/* 
      <PlayerPriceHistoryCard
        player={player}
      /> */}

    </div>
  );
}
