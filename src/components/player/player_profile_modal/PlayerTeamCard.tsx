import { IProAthlete } from '../../../types/athletes';
import { formatPosition } from '../../../utils/athleteUtils';
import FormIndicator from '../../shared/FormIndicator';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../shared/SecondaryText';
import TeamLogo from '../../team/TeamLogo';

type Props = {
  player: IProAthlete;
};

export default function PlayerTeamCard({ player }: Props) {
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
            <SecondaryText className="dark:text-slate-300 text-xs">
              {formatPosition(player.position)} | {formatPosition(player.position_class)}
            </SecondaryText>
          )}
        </div>
      </div>

      <div>{player.form && <FormIndicator form={player.form} />}</div>
    </RoundedCard>
  );
}
