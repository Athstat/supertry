import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import OtherLeaguesSection from '../fantasy-leagues/join_league_screen/other_leagues_section/OtherLeaguesSection';
import ShowcaseLeagueSection from '../fantasy-leagues/join_league_screen/showcase_section/ShowcaseLeagueSection';
import RoundedCard from '../shared/RoundedCard';

type Props = {
  fantasySeason: IFantasySeason
}

/** Serves a dashboard for a fantasy season */
export function FantasySeasonDashboard({fantasySeason} : Props) {
  // Tabs state (persist between visits)
  // const [activeTab, setActiveTab] = useQueryState<'my' | 'discover' | 'code'>('active_tab', {
  //   init: 'my'
  // });

  const key = `/user-joined-leagues/${fantasySeason.id}`;
  
  const { data: fetchedLeagues, isLoading: loadingUserLeagues } = useSWR(
    key, () => fantasyLeagueGroupsFetcher(fantasySeason.id), {
      revalidateOnFocus: false
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leagues = useMemo(() => (fetchedLeagues ?? []), [fetchedLeagues]);
  const isLoading = loadingUserLeagues;

  const showcaseLeague = useMemo(() => {
    return leagues.find((l) => {
      return l.type === 'official_league';
    });
  }, [leagues]);

  console.log("Showcase Leagues ", showcaseLeague);

  const otherLeagues = useMemo(() => {
    return leagues.filter(() => {
      return true;
    })
  }, [leagues]);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6' >
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
    <div className="flex flex-col gap-8">

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


    </div>
  );
}

async function fantasyLeagueGroupsFetcher(seasonId: string) {
  const joinedLeagues = await fantasyLeagueGroupsService.getJoinedLeagues(seasonId);
  const mineLeagues = await fantasyLeagueGroupsService.getMyCreatedLeagues(seasonId);

  const aggregate = [...mineLeagues, ...joinedLeagues];

  return aggregate;
}
