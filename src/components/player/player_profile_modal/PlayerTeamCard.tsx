import { IProAthlete } from '../../../types/athletes';
import { formatPosition } from '../../../utils/athleteUtils';
import FormIndicator from '../FormIndicator';
import SecondaryText from '../../ui/typography/SecondaryText';
import TeamLogo from '../../team/TeamLogo';
import RoundedCard from '../../ui/cards/RoundedCard';
import { positionsTooltipMap } from '../../../types/constants';
import { useTooltip } from '../../../hooks/ui/useTooltip';
import { useMemo } from 'react';

type Props = {
  player: IProAthlete;
};

export default function PlayerTeamCard({ player }: Props) {

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
    <RoundedCard className="flex dark:border-none flex-row p-4 rounded-2xl items-center justify-between transition-all duration-200">
      <div className="flex flex-row items-center gap-4">
        <TeamLogo
          url={player.team?.image_url}
          teamName={player.team?.athstat_name}
          className="w-10 h-10"
        />

        <div className="flex flex-col">
          <p className="text-sm font-semibold dark:text-white">{player.team?.athstat_name}</p>
          {player.position && player.position_class && (
            <div onClick={handleClickPosition} >
              <SecondaryText className="dark:text-slate-300 cursor-pointer text-xs">
                {formatPosition(player.position)} | {formatPosition(player.position_class)}
              </SecondaryText>
            </div>
          )}
        </div>
      </div>

      <div>{player.form && <FormIndicator form={player.form} />}</div>
    </RoundedCard>
  );
}
