import { User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import {
  FantasyLeagueGroupMember,
  FantasySeasonOverallRanking,
} from '../../../types/fantasyLeagueGroups';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../shared/SecondaryText';

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
  const { members, userMemberRecord } = useFantasyLeagueGroup();

  return (
    <div className="overflow-y-auto rounded-xl bg-slate-100 dark:bg-slate-800/40">
      <div className="flex  flex-row items-center p-3 justify-between">
        <div className="flex flex-row items-center gap-2">
          <SecondaryText className="text-md w-10">Rank</SecondaryText>
          <SecondaryText className="text-md">Manager</SecondaryText>
        </div>

        <div>
          <SecondaryText className="text-md">Points</SecondaryText>
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

      <div className="divide-y dark:divide-slate-700/20 divide-slate-300/40">
        {standings.map((member, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                const mRecord = members.find(m => m.user_id === member.user_id);

                if (mRecord) {
                  handleSelectMember(mRecord);
                }
              }}
            >
              <LeagueStandingsRow
                member={member}
                key={member.user_id}
                index={index}
                isUser={userMemberRecord?.user_id === member.user_id}
                hideUserScore={hideUserScore}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

type StandingsProps = {
  member: FantasySeasonOverallRanking;
  index: number;
  isUser?: boolean;
  hideUserScore?: boolean;
};

function LeagueStandingsRow({ member, isUser, hideUserScore, index }: StandingsProps) {
  const { members } = useFantasyLeagueGroup();
  const memberRecord = members.find(m => m.user_id === member.user_id);

  const rank = member.league_rank ?? index + 1;

  // const badge = useMemo(() => {
  //   switch (rank) {
  //     case 1:
  //       return '🏅';
  //       break;

  //     case 2:
  //       return '🥈';
  //     case 3:
  //       return '🥉';

  //     default:
  //       return undefined;
  //       break;
  //   }

  //   return undefined;
  // }, [rank]);

  const pointsDisplay =
    isUser && hideUserScore ? '-' : member.total_score ? Math.floor(member.total_score) : 0;

  return (
    <div
      className={twMerge(
        'flex flex-row  cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-800/60  p-3 items-center gap-2 justify-between',
        isUser && 'bg-blue-500 text-white'
      )}
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
          <p>{memberRecord?.user.username ?? member.username ?? member.first_name}</p>
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
