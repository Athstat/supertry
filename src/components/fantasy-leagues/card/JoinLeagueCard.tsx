import { ChevronRight, Loader, Users } from 'lucide-react';
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { useJoinLeague } from '../../../hooks/leagues/useJoinLeague';
import RoundedCard from '../../ui/cards/RoundedCard';
import LeagueGroupLogo from '../../fantasy_league/LeagueGroupLogo';
import { LeagueGoldCheckMark } from './LeagueBadge';

interface JoinLeagueCardProps {
  leagueGroup: FantasyLeagueGroup
}

export function JoinLeagueCard({ leagueGroup }: JoinLeagueCardProps) {

  const { handleJoinLeague: onJoin, isLoading: isJoining } = useJoinLeague();

  const name = leagueGroup.title;

  const handleJoin = useCallback(() => {
    const nextUrl = `/league/${leagueGroup.id}/standings`;

    onJoin(
      leagueGroup,
      nextUrl
    );

  }, [leagueGroup, onJoin])

  return (
    <RoundedCard className='py-2 px-4 dark:border-none rounded-md' >

      <div className={twMerge(
        "flex flex-row items-center justify-between",
      )}>

        <div className='flex flex-row items-center gap-2' >

          <LeagueGroupLogo
            league={leagueGroup}
            className='w-10 h-10'
          />

          <div className='flex flex-col gap-1' >
            <div className='flex flex-row items-center gap-1' >
              <h3 className="text-sm">{name}</h3>
              <LeagueGoldCheckMark clickable leagueGroup={leagueGroup} />
            </div>

            {leagueGroup.members_count && <div className="flex items-center gap-1 text-sm text-gray-400">
              <Users className='w-4 h-4' />
              <span className='text-xs' > {leagueGroup.members_count}</span>
            </div>}
          </div>
        </div>

        <div className='flex flex-row items-center gap-2' >
            <button onClick={handleJoin} >
              {!isJoining && <ChevronRight className='text-[#1196F5]' />}
              {isJoining && <Loader className='text-[#1196F5] animate-spin' />}
            </button>
        </div>

      </div>

    </RoundedCard>
  );
}