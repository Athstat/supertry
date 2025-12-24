import { Users } from 'lucide-react';
import { FantasyLeagueGroup } from '../types/fantasyLeagueGroups';
import RoundedCard from './shared/RoundedCard';
import PrimaryButton from './shared/buttons/PrimaryButton';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../services/fantasy/fantasyLeagueGroupsService';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface JoinLeagueCardProps {
  leagueGroup: FantasyLeagueGroup
}

export function JoinLeagueCard({ leagueGroup }: JoinLeagueCardProps) {

  const key = `/league-group/${leagueGroup.id}/league-group-members/`;
  const {data, isLoading} = useSWR(key, () => fantasyLeagueGroupsService.getGroupMembers(leagueGroup.id));

  const memberCount = useMemo(() => {
    return (data || []).length;
  }, [data])

  const name = leagueGroup.title;

  return (
    <RoundedCard className='py-2 px-4 dark:border-none ' >

      <div className={twMerge(
        "flex flex-row items-center justify-between",
        isLoading && "opacity-0"
      )}>

        <div className='flex flex-col gap-1' >
          <h3 className="text-sm">{name}</h3>

          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className='w-4 h-4' />
            <span className='text-xs' >Players {memberCount}</span>
          </div>
        </div>

        <PrimaryButton className="w-fit text-white py-1.5 px-2 text-xs font-medium transition-colors flex items-center">
          Join
          {/* <ChevronRight className='w-4 h-4' /> */}
        </PrimaryButton>

      </div>

    </RoundedCard>
  );
}