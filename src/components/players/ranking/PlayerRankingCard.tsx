import { IProAthlete } from '../../../types/athletes';
import TeamJersey from '../../player/TeamJersey';
import PlayerMugshot from '../../shared/PlayerMugshot';
import SecondaryText from '../../shared/SecondaryText';
import TeamLogo from '../../team/TeamLogo';

type Props = {
  rank: number | string;
  player: IProAthlete;
  onClick: (player: IProAthlete) => void;
  value: string | number;
};

/** Renders a Horizontal Player Ranking Card */
export function PlayerRankingCard({ rank, onClick, player, value }: Props) {
  const handleOnClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div
        onClick={handleOnClick}
        className="flex cursor-pointer flex-row items-center gap-4 overflow-hidden"
      >
        <div className="flex-shrink-0">
          <SecondaryText>#{rank}</SecondaryText>
        </div>

        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          {player.image_url && (
            <PlayerMugshot
              teamId={player.team?.athstat_id}
              className="w-14 bg-slate-100 dark:bg-slate-600/20 h-14"
              url={player.image_url}
            />
          )}

          {!player.image_url && (
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex flex-col items-center justify-center">
              <TeamJersey
                useBaseClasses={false}
                teamId={player.team?.athstat_id}
                className="h-10"
              />
            </div>
          )}

          <TeamLogo className="w-8 h-8" url={player.team?.image_url} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm truncate">{player.player_name}</p>
          <SecondaryText className="text-xs truncate">{player.team?.athstat_name}</SecondaryText>
        </div>

        <div className="flex-shrink-0 mr-4 flex flex-row items-center justify-end">
          <p className="font-bold text-sm">{value}</p>
        </div>
      </div>
    </div>
  );
}
