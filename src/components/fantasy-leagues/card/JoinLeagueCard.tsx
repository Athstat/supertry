import { ChevronRight, Users } from 'lucide-react';
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import PrimaryButton from '../../ui/buttons/PrimaryButton';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { useJoinLeague } from '../../../hooks/leagues/useJoinLeague';
import RoundedCard from '../../ui/cards/RoundedCard';
import LeagueGroupLogo from '../../fantasy_league/LeagueGroupLogo';

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
            <div className='flex flex-row items-center gap-2' >
              <h3 className="text-sm">{name}</h3>
            </div>

            {leagueGroup.members_count && <div className="flex items-center gap-1 text-sm text-gray-400">
              <Users className='w-4 h-4' />
              <span className='text-xs' >Players {leagueGroup.members_count}</span>
            </div>}
          </div>
        </div>

        <div className='flex flex-row items-center gap-2' >

          <PrimaryButton onClick={handleJoin} isLoading={isJoining} className="w-fit text-white py-1.5 px-2 text-xs font-medium transition-colors flex items-center">
            Join
            <ChevronRight className='w-4 h-4' />
          </PrimaryButton>
        </div>

      </div>

    </RoundedCard>
  );
}