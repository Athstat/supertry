import { IProAthlete } from '../../../types/athletes';
import TeamJersey from '../../player/TeamJersey';
import SecondaryText from '../../ui/typography/SecondaryText';
import RankNumberCard from '../../ui/cards/RankNumberCard';
import { usePlayerSeasonTeam } from '../../../hooks/seasons/useSeasonTeams';

type Props = {
  rank: number | string;
  player: IProAthlete;
  onClick: (player: IProAthlete) => void;
  value: string | number;
  borderColor?: string;
};

/** Renders a Horizontal Player Ranking Card */
export function PlayerRankingCard({ rank, onClick, player, value, borderColor = '#1196F5' }: Props) {
  
  const {seasonTeam} = usePlayerSeasonTeam(player);
  
  const handleOnClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#F0F3F7] drop-shadow-[2px_2px_2px_rgba(0,0,0,0.15)]">
      <div
        onClick={handleOnClick}
        className="flex cursor-pointer   flex-row items-center gap-4 overflow-hidden border-l-4 pl-2 py-2"
        style={{ borderLeftColor: borderColor }}
      >
        {/* Rank number with grey background */}
        <RankNumberCard 
          value={rank}
          fontSize='14px'
        />

        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          {seasonTeam && (
            <div className="w-10 h-10 bg-white overflow-clip dark:bg-gray-700 rounded-full flex flex-col items-center justify-center">
              <TeamJersey
                useBaseClasses={false}
                teamId={seasonTeam.athstat_id}
                className="h-9 mt-3"
                hideFade
              />
            </div>
          )}

          {/* <TeamLogo className="w-8 h-8" url={player.team?.image_url} /> */}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm truncate">{player.player_name}</p>
          <SecondaryText className="text-xs truncate">{seasonTeam?.athstat_name}</SecondaryText>
        </div>

        <div className="flex-shrink-0 mr-4 flex flex-row items-center justify-end">
          <p className="text-base">{value}</p>
        </div>
      </div>
    </div>
  );
}
