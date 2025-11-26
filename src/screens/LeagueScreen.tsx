import { useParams } from 'react-router-dom';
import FantasyLeagueGroupDataProvider from '../components/fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../hooks/leagues/useFantasyLeagueGroup';
import PageView from './PageView';
import { ErrorState } from '../components/ui/ErrorState';
import { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import { LeagueStandings } from '../components/fantasy-league/LeagueStandings';
import { LeaguePredictionsTab } from '../components/fantasy-league/LeaguePredictionsTab';
import LeagueInfoTab from '../components/fantasy-league/LeagueInfoTab';
import LeagueFixturesTab from '../components/fantasy-league/LeagueFixturesTab';
import LeagueCommissionerTab from '../components/fantasy-league/commissioner/LeagueCommissionerTab';
import MyTeamsTab from '../components/fantasy-leagues/MyTeamTab';
import { useQueryState } from '../hooks/useQueryState';
import { useEffect, useState } from 'react';
import PilledTabView from '../components/shared/tabs/PilledTabView';
import LearnScrummyNoticeCard from '../components/branding/help/LearnScrummyNoticeCard';
import { fantasyAnalytics } from '../services/analytics/fantasyAnalytics';
import { useHideBottomNavBar } from '../hooks/navigation/useNavigationBars';
import LeagueGroupScreenHeader from '../components/fantasy-league/LeagueGroupScreenHeader';
import RoundedCard from '../components/shared/RoundedCard';

export function FantasyLeagueScreen() {
  const { leagueId } = useParams();

  return (
    <FantasyLeagueGroupDataProvider
      loadingFallback={<LoadingSkeleton />}
      leagueId={leagueId}>
      <Content />
    </FantasyLeagueGroupDataProvider>
  );
}

function Content() {
  /** Auto Hides Top Bar to Maximise screen space */
  // useHideTopNavBar();
    useHideBottomNavBar();

  const { league, userMemberRecord } = useFantasyLeagueGroup();

  const [journey] = useQueryState('journey');

  let initialTabKey = journey === 'team-creation' ? 'my-team' : undefined;
  initialTabKey = journey === 'my-team' ? 'my-team' : initialTabKey;
  initialTabKey = journey === 'standings' ? 'standings' : initialTabKey;

  // Hooks must be declared before any early returns
  const [isEditing,] = useState<boolean>(false);

  useEffect(() => {
    fantasyAnalytics.trackVisitedLeagueScreen(league?.id);
  }, [league?.id]);

  if (!league && !league) {
    return <ErrorState error="Whoops" message="Fantasy League was not found" />;
  }

  const headerItems: TabViewHeaderItem[] = [
    // {
    //   label: 'Overview',
    //   tabKey: 'overview',
    //   className: 'w-fit',
    // },

    {
      label: 'My Team',
      tabKey: 'my-team',
      className: 'w-fit',
    },
    {
      label: 'Standings',
      tabKey: 'standings',
      className: 'w-fit',
    },
    {
      label: 'Predictions',
      tabKey: 'predictions',
      className: 'w-fit',
    },

    {
      label: 'Commissioner',
      tabKey: 'commissioner',
      className: 'w-fit',
      disabled: !userMemberRecord || userMemberRecord.is_admin == false,
    },

    {
      label: 'Info',
      tabKey: 'info',
      className: 'w-fit',
    },
  ];

  return (
    <PageView className="dark:text-white dark:bg-[#0D0D0D] flex flex-col gap-4">
      <LeagueGroupScreenHeader isEditing={isEditing} />

      <LearnScrummyNoticeCard />

      {/* <div
        onClick={navigateToLeagues}
        className="flex flex-row hover:text-blue-500 cursor-pointer items-center"
      >
        <ArrowLeft />
        Back
      </div> */}

      {/* <div className="flex flex-row flex-wrap overflow-hidden items-center gap-2">
        <StatCard label="Members" value={members?.length ?? '-'} className="flex-1" />

        <StatCard label="Current Round" value={currentRound?.title} className="flex-1" />
      </div> */}

      <PilledTabView
        initialTabKey={initialTabKey}
        tabHeaderItems={headerItems}
        pillTabRowClassName="px-4"
      >
        <TabViewPage tabKey="my-team">
          <MyTeamsTab />
        </TabViewPage>

        <TabViewPage tabKey="standings" className="">
          <LeagueStandings />
        </TabViewPage>

        <TabViewPage tabKey="predictions" className="px-4">
          <LeaguePredictionsTab />
        </TabViewPage>

        <TabViewPage tabKey="info" className="px-4">
          <LeagueInfoTab />
        </TabViewPage>

        <TabViewPage tabKey="fixtures" className="px-4">
          <LeagueFixturesTab />
        </TabViewPage>

        <TabViewPage tabKey="commissioner" className="px-4">
          <LeagueCommissionerTab />
        </TabViewPage>

      </PilledTabView>
    </PageView>
  );
}


function LoadingSkeleton() {

  // useHideTopNavBar();
  useHideBottomNavBar();

  return (
    <PageView className='p-4 animate-pulse overflow-hidden flex flex-col gap-4' >
      <div className='flex flex-row items-center justify-between' >

        <div className='flex flex-row items-center gap-2' >
          <RoundedCard className='border-none w-[30px] h-[25px] ' />
          <RoundedCard className='border-none w-[100px] h-[25px] ' />
        </div>

        <RoundedCard className='border-none w-[100px] h-[40px] ' />

      </div>

      <div className='flex flex-row items-center gap-2' >
        <RoundedCard className='border-none w-[100px] h-[25px] ' />
        <RoundedCard className='border-none w-[100px] h-[25px] ' />
        <RoundedCard className='border-none w-[90px] h-[25px] ' />
        <RoundedCard className='border-none w-[70px] h-[25px] ' />
      </div>

      <div className='flex flex-col items-center gap-2' >
        <RoundedCard className='border-none w-full h-[100px] ' />
        <RoundedCard className='border-none w-full h-[500px] ' />
        <RoundedCard className='border-none w-full h-[40px] ' />
      </div>

    </PageView>
  )
}