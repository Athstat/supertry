import { useEffect } from 'react';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import LeagueAndStandingsSection from '../fantasy-leagues/join_league_screen/other_leagues_section/LeagueAndStandingsSection';
import ManageTeamCTA from '../fantasy-leagues/join_league_screen/showcase_section/ManageTeamCTA';
import RoundedCard from '../shared/RoundedCard';
import { useFeaturedLeague } from '../../hooks/leagues/useFeaturedLeague';

type Props = {
  fantasySeason: IFantasySeason
}

/** Serves a dashboard for a fantasy season */
export function FantasyCompetitionDashboard({ fantasySeason }: Props) {

  const {featuredLeague: featuredGroup, isLoading} = useFeaturedLeague();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="flex flex-col gap-8">

      {featuredGroup && <ManageTeamCTA
        leagueGroup={featuredGroup}
      />}

      <LeagueAndStandingsSection
        fantasySeason={fantasySeason}
      />

    </div>
  );
}



function LoadingSkeleton() {
  return (
    <div className='flex flex-col gap-6' >
      <div className='flex flex-row items-center justify-between' >
        <div className='flex flex-col gap-1' >
          <RoundedCard className='w-[100px] h-[25px] rounded-xl border-none' />
          <RoundedCard className='w-[60px] h-[20px] rounded-xl border-none' />
        </div>

        <div>
          <RoundedCard className='w-[40px] h-[30px] border-none rounded-xl animate-pulse' />
        </div>
      </div>

      <div className='flex flex-col gap-2' >
        <RoundedCard className='w-full h-[100px] border-none rounded-xl animate-pulse' />
      </div>

      <div className='flex flex-col gap-3' >
        <div className='flex flex-row items-center justify-between' >
          <RoundedCard className='w-[100px] h-[30px] border-none rounded-xl animate-pulse' />
          <RoundedCard className='w-[100px] h-[30px] border-none rounded-xl animate-pulse' />
        </div>
        <RoundedCard className='w-full h-[60px] mt-5 border-none rounded-xl animate-pulse' />
        <RoundedCard className='w-full h-[60px] border-none rounded-xl animate-pulse' />
        <RoundedCard className='w-full h-[60px] border-none rounded-xl animate-pulse' />
        <RoundedCard className='w-full h-[60px] border-none rounded-xl animate-pulse' />
      </div>
    </div>
  )
}