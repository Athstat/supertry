import { User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import {
  FantasyLeagueGroupMember,
  FantasySeasonOverallRanking,
} from '../../../types/fantasyLeagueGroups';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../shared/SecondaryText';
import { useMemo } from 'react';
import { useLeagueRoundStandingsFilter } from '../../../hooks/fantasy/useLeagueRoundStandingsFilter';
import { useAuth } from '../../../contexts/AuthContext';

type Props = {
  isLoading?: boolean;
  standings: FantasySeasonOverallRanking[];
  handleSelectMember: (m: FantasyLeagueGroupMember) => void;
  hideUserScore?: boolean;
};

/** Renders a league standings table component */
export default function LeagueStandingsTable({
  isLoading,
  standings,
  handleSelectMember,
  hideUserScore,
}: Props) {

  const {authUser} = useAuth();
  const { selectedRound } = useLeagueRoundStandingsFilter();

  const { members } = useFantasyLeagueGroup();
  const exclude_ids = standings.map((s) => {
    return s.user_id;
  })

  const leftOutMembers = members.filter((m) => {
    return !exclude_ids.includes(m.user_id);
  })

  const completeStandings: (FantasySeasonOverallRanking)[] = useMemo(() => {
    const base = [...standings];
    const membersWhoDidntScorePoints = leftOutMembers.map<(FantasySeasonOverallRanking)>((m) => {
      return {
        user_id: m.user_id,
        first_name: m.user.first_name,
        last_name: m.user.last_name,
        username: m.user.username,
        total_score: 0,
        rank: undefined,
        league_rank: undefined,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return [...base, ...membersWhoDidntScorePoints];
  }, [leftOutMembers, standings])

  return (
    <div className="overflow-y-auto rounded-xl bg-slate-100 dark:bg-slate-800/40">
      <div className="flex  flex-row items-center p-3 justify-between">
        <div className="flex flex-row items-center gap-2">
          <SecondaryText className="text-md w-10">Rank</SecondaryText>
          <SecondaryText className="text-md">Manager</SecondaryText>
        </div>

        <div>
          <SecondaryText className="text-md">{selectedRound ? `${selectedRound.title} Points` : "Points"}</SecondaryText>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4 animate-pulse p-4">
          <RoundedCard className="border-none h-8 w-1/3 lg:w-1/4" />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <RoundedCard className="border-none h-8 w-32" />
              <RoundedCard className="border-none h-8 w-20" />
            </div>

            <RoundedCard className="border-none h-8 w-20" />
          </div>

          <div className="flex flex-col gap-2">
            <RoundedCard className="border-none h-12 w-full" />
            <RoundedCard className="border-none h-12 w-full" />
            <RoundedCard className="border-none h-12 w-full" />
          </div>
        </div>
      )}

      {!isLoading && <div className="divide-y dark:divide-slate-700/20 divide-slate-300/40">
        {completeStandings.map((ranking, index) => {
          return (
            <div
              key={ranking.user_id}
            >
              <LeagueStandingsRow
                ranking={ranking}
                key={ranking.user_id}
                index={index}
                isUser={authUser?.kc_id === ranking.user_id}
                hideUserScore={hideUserScore}
                onClick={handleSelectMember}
              />
            </div>
          );
        })}
      </div>}
    </div>
  );
}

type StandingsProps = {
  ranking: FantasySeasonOverallRanking;
  index: number;
  isUser?: boolean;
  hideUserScore?: boolean;
  onClick?: (member: FantasyLeagueGroupMember) => void
};

function LeagueStandingsRow({ ranking, isUser, hideUserScore, index, onClick }: StandingsProps) {
  const { members } = useFantasyLeagueGroup();
  const memberRecord = members.find(m => m.user_id === ranking.user_id);

  const rank = ranking.league_rank ?? index + 1;

  const pointsDisplay =
    isUser && hideUserScore ? '-' : ranking.total_score ? Math.floor(ranking.total_score) : '-';

  const handleClick = () => {
    if (onClick && memberRecord) {
      onClick(memberRecord);
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
          <p>{memberRecord?.user.username ?? ranking.username ?? ranking.first_name}</p>
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
