import { useEffect, useMemo } from 'react';
import ShowcaseLeagueSection from '../components/fantasy-leagues/join_league_screen/showcase_section/ShowcaseLeagueSection';
import useSWR from 'swr';
import { LoadingState } from '../components/ui/LoadingState';
import PageView from './PageView';
import { fantasyLeagueGroupsService } from '../services/fantasy/fantasyLeagueGroupsService';
import OtherLeaguesSection from '../components/fantasy-leagues/join_league_screen/other_leagues_section/OtherLeaguesSection';
import RoundedCard from '../components/shared/RoundedCard';

export function FantasyLeaguesScreen() {
  // Tabs state (persist between visits)
  // const [activeTab, setActiveTab] = useQueryState<'my' | 'discover' | 'code'>('active_tab', {
  //   init: 'my'
  // });

  const key = `/user-joined-leagues`;
  const { data: fetchedLeagues, isLoading: loadingUserLeagues } = useSWR(
    key, () => fantasyLeagueGroupsFetcher(), {
    revalidateIfStale: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leagues = (fetchedLeagues ?? []);
  const isLoading = loadingUserLeagues;

  const showcaseLeague = useMemo(() => {
    return leagues.find((l) => {
      return l.type === 'official_league';
    });
  }, [leagues]);

  console.log("Showcase Leagues ", showcaseLeague);

  const otherLeagues = useMemo(() => {
    return leagues.filter((l) => {
      return l.id !== showcaseLeague?.id
    })
  }, [showcaseLeague, leagues]);

  if (isLoading) {
    return (
      <div className='p-6 flex flex-col gap-6' >
        <div>
          <div className='flex flex-col gap-1' >
            <RoundedCard className='w-[100px] h-[25px] rounded-xl border-none' />
            <RoundedCard className='w-[60px] h-[20px] rounded-xl border-none' />
          </div>
        </div>

        <div className='flex flex-col gap-2' >
          <RoundedCard className='w-full h-[200px] border-none rounded-xl animate-pulse' />
          <RoundedCard className='w-full h-[70px] border-none rounded-xl animate-pulse' />
        </div>

        <div className='flex flex-col gap-3' >
          <div className='flex flex-row items-center justify-between' >
            <RoundedCard className='w-[100px] h-[30px] border-none rounded-xl animate-pulse' />
            <RoundedCard className='w-[40px] h-[30px] border-none rounded-xl animate-pulse' />
          </div>
          <RoundedCard className='w-full h-[60px] mt-5 border-none rounded-xl animate-pulse' />
          <RoundedCard className='w-full h-[60px] border-none rounded-xl animate-pulse' />
          <RoundedCard className='w-full h-[60px] border-none rounded-xl animate-pulse' />
          <RoundedCard className='w-full h-[60px] border-none rounded-xl animate-pulse' />
        </div>
      </div>
    )
  }

  return (
    <PageView className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl flex flex-col gap-8">

      {/* <div className="flex items-center mb-4 gap-2 sm:mb-6 justify-between">

        <div className='flex flex-row gap-2 items-center justify-center' >
          <Trophy className='dark:text-white w-4 h-4' />
          <h1 className="font-bold dark:text-white flex-1">Fantasy Leagues</h1>
        </div>

        <div>
        </div>
      </div> */}

      {showcaseLeague && <ShowcaseLeagueSection
        leagueGroup={showcaseLeague}
      />}

      <OtherLeaguesSection
        joinedLeagues={otherLeagues}
      />


    </PageView>
  );
}

async function fantasyLeagueGroupsFetcher() {
  const joinedLeagues = await fantasyLeagueGroupsService.getJoinedLeagues();
  const mineLeagues = await fantasyLeagueGroupsService.getMyCreatedLeagues();

  const aggregate = [...mineLeagues, ...joinedLeagues];

  return aggregate;
}
