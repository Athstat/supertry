import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import ShowcaseLeagueSection from '../components/fantasy-leagues/join_league_screen/showcase_section/ShowcaseLeagueSection';
import useSWR from 'swr';
import { LoadingState } from '../components/ui/LoadingState';
import PageView from './PageView';
import { fantasyLeagueGroupsService } from '../services/fantasy/fantasyLeagueGroupsService';

export function FantasyLeaguesScreen() {
  // Tabs state (persist between visits)
  // const [activeTab, setActiveTab] = useQueryState<'my' | 'discover' | 'code'>('active_tab', {
  //   init: 'my'
  // });

  const key = `/user-joined-leagues`;
  const {data: fetchedLeagues, isLoading: loadingUserLeagues} = useSWR(
    key, () => fantasyLeagueGroupsService.getJoinedLeagues());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leagues = (fetchedLeagues ?? []);
  const isLoading = loadingUserLeagues;

  const showcaseLeague = leagues.find((l) => {
    return l.type === 'official_league';
  });
  
  console.log(leagues);

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <PageView className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      
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
      
    </PageView>
  );
}
