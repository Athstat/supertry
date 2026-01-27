import PageView from '../../components/ui/containers/PageView';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import AutoJoinLeagueModal from '../../components/fantasy-leagues/AutoJoinLeagueModal';
import RoundedScreenHeader from '../../components/ui/containers/RoundedScreenHeader';
import ThinTrophyIcon from '../../components/ui/icons/ThinTrophyIcon';
import { useFeaturedLeague } from '../../hooks/leagues/useFeaturedLeague';
import TeamPreview from '../../components/fantasy-leagues/TeamPreview';
import LeagueAndStandingsSection from '../../components/fantasy-leagues/other_leagues_section/LeagueAndStandingsSection';
import RoundedCard from '../../components/ui/cards/RoundedCard';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason, isLoading: loadingFantasySeasons } = useFantasySeasons();
  const { featuredLeague: featuredGroup, isLoading: loadingFeaturedLeague } = useFeaturedLeague();

  const isLoading = loadingFantasySeasons || loadingFeaturedLeague;

  if (isLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <PageView className="flex flex-col">

      <RoundedScreenHeader
        title='Fantasy'
        leadingIcon={<ThinTrophyIcon />}
        className='rounded-none'
      />

      <TeamPreview
        leagueGroup={featuredGroup}
      />

      <LeagueAndStandingsSection
        fantasySeason={selectedSeason}
      />

      <AutoJoinLeagueModal />

    </PageView>
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