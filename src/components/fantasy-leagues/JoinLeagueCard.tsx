
import { useCallback } from 'react';
import { Loader } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import RoundedCard from '../ui/cards/RoundedCard';
import SecondaryText from '../ui/typography/SecondaryText';
import LeagueMembersIcon from '../ui/icons/LeagueMembersIcon';
import LeagueGroupLogo from '../fantasy_league/LeagueGroupLogo';
import { useJoinLeague } from '../../hooks/leagues/useJoinLeague';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { useLeagueGroupMembersCount } from '../../hooks/leagues/useLeagueGroupMembersCount';

interface JoinLeagueCardProps {
  leagueGroup: FantasyLeagueGroup
}

export function JoinLeagueCard({ leagueGroup }: JoinLeagueCardProps) {

  const { handleJoinLeague: onJoin, isLoading: isJoining } = useJoinLeague();

  const { formattedCount, isLoading: loadingMembers } = useLeagueGroupMembersCount(leagueGroup.id);
  const isLoading = loadingMembers;

  const handleJoin = useCallback(() => {
    const nextUrl = `/league/${leagueGroup.id}/standings`;

    onJoin(
      leagueGroup,
      nextUrl
    );

  }, [leagueGroup, onJoin])

  return (
    <RoundedCard className='py-2 px-4 dark:border-none bg-[#EDF1F6] dark:bg-slate-700 shadow-[0px_1px_3px_rgba(0,0,0,0.25)]' >

      <div className={twMerge(
        "flex flex-row items-center justify-between",
        isLoading && "opacity-0"
      )}>

        <div className='flex flex-row items-center gap-2' >

          <div className="w-12 h-12 overflow-clip bg-white dark:bg-slate-800 rounded-md" >
            <LeagueGroupLogo
              className="overflow-visible"
              objectClassName="h-12 w-12"
              league={leagueGroup}
            />
          </div>

          <div>
            <p className="text-base text-gray-900 dark:text-white truncate">
              {leagueGroup.title}
            </p>

            <div className="flex flex-row items-center gap-1.5" >
              <LeagueMembersIcon />
              {!isLoading && <SecondaryText>{formattedCount}</SecondaryText>}
            </div>
          </div>

        </div>

        <button onClick={handleJoin} disabled={isJoining} className="w-fit text-white py-1.5 px-2 text-xs font-medium transition-colors flex items-center">
          {!isJoining && <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 14.3333L7.66667 7.66667L1 1" stroke="#1196F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>}

          {isJoining && (
            <Loader className='animate-spin text-[#1196F5]' />
          )}
        </button>

      </div>

    </RoundedCard>
  );
}