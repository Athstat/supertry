import { IProAthlete } from '../../../types/athletes';
import { formatPosition, getPositionTooltip } from '../../../utils/athleteUtils';
import FormIndicator from '../FormIndicator';
import SecondaryText from '../../ui/typography/SecondaryText';
import TeamLogo from '../../team/TeamLogo';
import RoundedCard from '../../ui/cards/RoundedCard';
import { useTooltip } from '../../../hooks/ui/useTooltip';
import { HelpCircle } from 'lucide-react';
import { usePlayerSeasonTeam } from '../../../hooks/seasons/useSeasonTeams';

type Props = {
  player: IProAthlete;
};

/** Renders a card showing a player's team card */
export default function PlayerTeamCard({ player }: Props) {

  const { openTooltipModal } = useTooltip();

  const positionDef = getPositionTooltip(player.position, player.position_class);

  const handleClickPosition = () => {
    if (positionDef) {
      const { title, description } = positionDef
      openTooltipModal(title, description)
    }
  }

  const {seasonTeam} = usePlayerSeasonTeam(player);

  return (
    <RoundedCard className="flex dark:border-none flex-row p-4 rounded-2xl items-center justify-between transition-all duration-200">
      <div className="flex flex-row items-center gap-4">
        <TeamLogo
          url={seasonTeam?.image_url}
          teamName={seasonTeam?.athstat_name}
          className="w-10 h-10"
        />

        <div className="flex flex-col">
          <p className="text-sm font-semibold dark:text-white">{seasonTeam?.athstat_name}</p>


          {player.position && player.position_class && (
            <div 
              onClick={handleClickPosition} 
              className='flex flex-row hover:cursor-pointer items-center gap-1'
            >
              <SecondaryText className="dark:text-slate-300 hover:underline cursor-pointer text-xs">
                {formatPosition(player.position)} | {formatPosition(player.position_class)}
              </SecondaryText>

              <HelpCircle className='w-3 h-3 text-slate-600 dark:text-slate-300' />
            </div>
          )}

        </div>
      </div>

      <div>{player.form && <FormIndicator form={player.form} />}</div>
    </RoundedCard>
  );
}
