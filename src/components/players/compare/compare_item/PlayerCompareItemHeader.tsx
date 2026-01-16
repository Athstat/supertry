import { IProAthlete } from '../../../../types/athletes';
import { X, ChevronLeft, ChevronRight, Coins } from 'lucide-react';
import { formatPosition } from '../../../../utils/athletes/athleteUtils';
import SecondaryText from '../../../ui/typography/SecondaryText';
import { twMerge } from 'tailwind-merge';
import { usePlayerCompareActions } from '../../../../hooks/usePlayerCompare';
import SmartPlayerMugshot from '../../../player/SmartPlayerMugshot';
import { useMemo } from 'react';
import { useTooltip } from '../../../../hooks/ui/useTooltip';
import { positionsTooltipMap } from '../../../../types/constants';
import { calculateAge } from '../../../../utils/playerUtils';
import { getCountryEmojiFlag } from '../../../../utils/svrUtils';
import TeamLogo from '../../../team/TeamLogo';
import RoundedCard from '../../../ui/cards/RoundedCard';
import PlayerCompareSeasonPicker from '../season_stats/PlayerCompareSeasonPicker';
import { usePlayerCompareItem } from '../../../../hooks/athletes/usePlayerCompareItem';

type Props = {
  player: IProAthlete;
};

export default function PlayerCompareItemHeader({ player }: Props) {

  const {selectedSeason, seasons, switchSeason, hasNoData} = usePlayerCompareItem();

  const { movePlayerLeft, movePlayerRight, removePlayer } = usePlayerCompareActions();

  const { openTooltipModal } = useTooltip();

  const positionKey = useMemo(() => {
    const lowCase = player.position?.toLowerCase();
    if (lowCase) {
      return lowCase.replace(' ', '_');
    }

    return lowCase || '';
  }, [player.position])

  const positionDef = positionsTooltipMap.get(positionKey || '');

  const handleClickPosition = () => {
    if (positionDef) {
      const { title, description } = positionDef
      const finalTitle = title && player.position_class ? `${title} - ${formatPosition(player.position_class)}` : title;
      openTooltipModal(finalTitle, description)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={twMerge(
          'flex flex-col bg-slate-100 dark:bg-slate-700/50 items-center justify-between p-1 rounded-lg',
          'border border-slate-200 dark:border-slate-600'
        )}
      >
        <div className='flex flex-row items-center justify-between w-full' >
          <div className="flex flex-row items-center gap-1">
            <button
              onClick={() => movePlayerLeft(player)}
              className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => movePlayerRight(player)}
              className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button>
            <button
              onClick={() => removePlayer(player)}
              className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
            >
              <X className="w-5 h-5" />
            </button>
          </button>
        </div>

        <div className='flex flex-col items-center justify-center gap-2' >
          <SmartPlayerMugshot
            url={player.image_url}
            teamId={player.team_id}
            className='w-16 h-16'
            playerImageClassName='w-16 h-16'
            jerseyClassName='w-16 h-16'
          />

          <div className='flex flex-col gap-1 items-center justify-center' >
            <p className='font-semibold text-sm' >{player.player_name}</p>

            {player.position && player.position_class && (
              <div onClick={handleClickPosition} >
                <SecondaryText className="dark:text-slate-300 hover:underline cursor-pointer text-xs">
                  {formatPosition(player.position)} | {formatPosition(player.position_class)}
                </SecondaryText>
              </div>
            )}

          </div>
        </div>

      </div>

      {seasons && !hasNoData && (
        <PlayerCompareSeasonPicker
          seasons={seasons}
          setCurrSeason={switchSeason}
          currSeason={selectedSeason}
        />
      )}

      {hasNoData && (
        <RoundedCard className='p-2 min-h-[40px] rounded-md flex flex-col items-center justify-center' >
          <SecondaryText className='text-xs truncate w-[95%]' >Whoops! No data was found for <strong>{player.player_name}</strong></SecondaryText>
        </RoundedCard>
      )}

      <GeneralInformationSection
        player={player}
      />

    </div>
  );
}

type GeneralInfoProps = {
  player: IProAthlete
}

function GeneralInformationSection({ player }: GeneralInfoProps) {
  return (
    <RoundedCard className="flex flex-col text-sm p-4 divide-y gap- divide-slate-100 dark:divide-slate-700">

      <div className='flex flex-row items-center justify-between py-1' >
        <SecondaryText className="text-xs">Team</SecondaryText>
        <div className="flex flex-row gap-1 items-center">
          <TeamLogo
            teamName={player.team?.athstat_name}
            url={player.team?.image_url}
            className="w-4 h-4"
          />
          <p className="text-xs lg:text-sm truncate">{player.team?.athstat_name}</p>
        </div>
      </div >

      <div className='flex flex-row items-center justify-between py-1' >
        <SecondaryText className="text-xs">Age</SecondaryText>
        <p className="text-xs lg:text-sm truncate">
          {player.date_of_birth ? calculateAge(player.date_of_birth) : '-'}
        </p>
      </div>

      <div className='flex flex-row items-center justify-between py-1' >
        <SecondaryText className="text-xs">Fantasy Price</SecondaryText>
        <div className="flex flex-row gap-1 items-center">
          <Coins className="w-4 h-4 text-yellow-500" />
          <p className="text-xs lg:text-sm truncate">{player.price}</p>
        </div>
      </div>

      <div className='flex flex-row items-center justify-between py-1' >
        <SecondaryText className="text-xs">Nationality</SecondaryText>
        <p className="text-xs lg:text-sm truncate">
          {getCountryEmojiFlag(player.nationality)} {player.nationality || '-'}
        </p>
      </div>

    </RoundedCard >
  )
}
