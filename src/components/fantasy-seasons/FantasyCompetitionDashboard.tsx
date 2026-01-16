import { useEffect } from 'react';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import ManageTeamCTA from '../fantasy-leagues/ManageTeamCTA';
import { useFeaturedLeague } from '../../hooks/leagues/useFeaturedLeague';
import LeagueAndStandingsSection from '../fantasy-leagues/other_leagues_section/LeagueAndStandingsSection';
import RoundedCard from '../ui/cards/RoundedCard';
import EditFantasyClubCTA from '../fantasy_clubs/EditFantasyClubCTA';

type Props = {
  fantasySeason: IFantasySeason
}

/** Serves a dashboard for a fantasy season */
export function FantasySeasonDashboard({ fantasySeason }: Props) {

  const { featuredLeague: featuredGroup, isLoading } = useFeaturedLeague();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div className='px-4' >
        <EditFantasyClubCTA />
      </div>

      {featuredGroup && (
        <div className='px-4' >
          <ManageTeamCTA
            leagueGroup={featuredGroup}
          />
        </div>
      )}

      <LeagueAndStandingsSection
        fantasySeason={fantasySeason}
      />

    </div>
  );
}



function LoadingSkeleton() {
  return (
    <div className='flex flex-col gap-6' >

      <div className='flex flex-col gap-2 px-4' >
        <RoundedCard className='w-full h-[140px] border-none rounded-xl animate-pulse' />
      </div>

      <div className='flex flex-col gap-4 px-4' >
        <RoundedCard className='w-[200px] h-[35px] border-none rounded-xl animate-pulse' />
        <RoundedCard className='w-full h-[45px] border-none rounded-xl animate-pulse' />
      </div>

      <div className='flex flex-col gap-3' >
        <RoundedCard className='w-full h-[150px] mt-5 border-none rounded-none animate-pulse' />
        <RoundedCard className='w-full h-[150px] border-none rounded-none animate-pulse' />
        <RoundedCard className='w-full h-[150px] border-none rounded-none animate-pulse' />
        <RoundedCard className='w-full h-[150px] border-none rounded-none animate-pulse' />
      </div>
    </div>
  )
}