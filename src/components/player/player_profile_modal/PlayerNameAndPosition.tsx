import SecondaryText from '../../ui/typography/SecondaryText';
import { formatPosition } from '../../../utils/athletes/athleteUtils';
import FormIndicator from '../FormIndicator';

import AvailabilityIcon from '../../players/availability/AvailabilityIcon';
import { usePlayerData } from '../../../providers/PlayerDataProvider';
import MatchPrCard from '../../rankings/MatchPrCard';
import ScoutPlayerButton from './ScoutPlayerButton';
import { useMemo } from 'react';
import { useTooltip } from '../../../hooks/ui/useTooltip';
import { positionsTooltipMap } from '../../../types/constants';
import { HelpCircle } from 'lucide-react';

export default function PlayerNameAndPosition() {
  const { player } = usePlayerData();

  const { openTooltipModal } = useTooltip();

  const positionKey = useMemo(() => {
    const lowCase = player?.position?.toLowerCase();
    if (lowCase) {
      return lowCase.replace(' ', '_');
    }

    return lowCase || '';
  }, [player?.position])

  const positionDef = positionsTooltipMap.get(positionKey || '');

  const handleClickPosition = () => {
    if (positionDef) {
      const { title, description } = positionDef
      const finalTitle = title && player?.position_class ? `${title} - ${formatPosition(player?.position_class)}` : title;
      openTooltipModal(finalTitle, description)
    }
  }

  if (!player) return null;

  return (
    <>
      <div className="flex flex-row items-start mt-2 justify-between ">
        <div className="flex flex-row items-center gap-3">

          {/* {player.team && (
            <TeamLogo
              url={player.team?.image_url}
              teamName={player.team?.athstat_name}
              className="w-10 h-10"
            />
          )} */}


          <div>
            <div className='flex flex-row items-center gap-2' >

              <p className="font-semibold text-lg dark:text-white">{player.player_name}</p>
              {player.form && <FormIndicator form={player.form} />}

            </div>

            <div className='flex flex-row items-center gap-2' >

              <ScoutPlayerButton player={player} />

              <button 
                onClick={handleClickPosition}
                className='flex flex-row items-center gap-1' 
              >
                <SecondaryText className="text-xs hover:underline">
                  {player.position && player.position_class && (
                    <span>
                      {' '}
                      {formatPosition(player.position)} - {formatPosition(player.position_class)}
                    </span>
                  )}
                </SecondaryText>

                <HelpCircle className='w-3 h-3 text-slate-600 dark:text-slate-300' />
              </button>

              {!player.team && player.position && (
                <SecondaryText>{formatPosition(player.position)}</SecondaryText>
              )}
            </div>
          </div>

        </div>

        <div className="flex flex-row items-center gap-3">

          {player.power_rank_rating && (
            <div className="flex flex-col items-center gap-1">
              <MatchPrCard
                pr={player.power_rank_rating}
                className='w-9 h-9 text-base font-medium'
              />
              <SecondaryText className='text-xs' >PR</SecondaryText>
            </div>
          )}
          <AvailabilityIcon athlete={player} />
        </div>

      </div>


      {/* {currentSeason && <div className="px-4 mt-2 w-full flex flex-row items-center justify-center">
        <PlayerIconsRow
          player={player}
          season={currentSeason}
          size="sm"
        />
      </div>} */}
    </>
  );
}
