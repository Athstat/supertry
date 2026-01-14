import { User } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { FantasySeasonRankingItem } from "../../../types/fantasyLeagueGroups";
import { smartRoundUp } from "../../../utils/intUtils";
import SecondaryText from "../../ui/typography/SecondaryText";

type StandingsProps = {
  ranking: FantasySeasonRankingItem;
  index: number;
  isUser?: boolean;
  hideUserScore?: boolean;
  onClick?: (member: FantasySeasonRankingItem) => void
};

/** Renders a league standing table row */
export function LeagueStandingsTableRow({ ranking, isUser, hideUserScore, index, onClick }: StandingsProps) {

  const rank = ranking.league_rank ?? index + 1;
  const shouldHideScore = (isUser && hideUserScore) || !ranking.total_score
  const pointsDisplay = shouldHideScore ? '-' : smartRoundUp(ranking.total_score);

  const handleClick = () => {
    if (onClick && ranking) {
      onClick(ranking);
    }
  }

  return (
    <div
      className={twMerge(
        'flex flex-row  cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-800/60  p-3 items-center gap-2 justify-between',
        isUser && 'bg-blue-500 text-white'
      )}

      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row">
          {/* {badge && <div className='text-sm' >{badge}</div>} */}
          <SecondaryText className={twMerge(
            "w-10",
            isUser && "text-white dark:text-white"
          )}>
            {/* {rank} {badge}{' '} */}
            {rank}
          </SecondaryText>
        </div>

        {isUser && (
          <div className=" w-6 h-6 bg-blue-500 rounded-xl flex flex-col items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}

        <div className="flex flex-col">
          <p>{ranking.username ?? ranking.first_name}</p>
          {isUser && hideUserScore && (
            <p className={twMerge('text-xs', isUser ? 'text-white/80' : 'text-gray-500')}>
              Claim account to see your points
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p>{pointsDisplay}</p>
      </div>
    </div>
  );
}
