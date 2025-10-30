import { useParams } from 'react-router-dom';
import FantasyLeagueGroupDataProvider from '../components/fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../hooks/leagues/useFantasyLeagueGroup';
import PageView from './PageView';
import { ErrorState } from '../components/ui/ErrorState';
import { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import { LeagueStandings } from '../components/fantasy-league/LeagueStandings';
import LeagueInfoTab from '../components/fantasy-league/LeagueInfoTab';
import LeagueFixturesTab from '../components/fantasy-league/LeagueFixturesTab';
import LeagueCommissionerTab from '../components/fantasy-league/commissioner/LeagueCommissionerTab';
import MyTeams from '../components/fantasy-leagues/MyTeams';
import { useQueryState } from '../hooks/useQueryState';
import { useEffect, useState } from 'react';
import LeagueOverviewTab from '../components/fantasy-league/overview/LeagueOverviewTab';
import PilledTabView from '../components/shared/tabs/PilledTabView';
import LearnScrummyNoticeCard from '../components/branding/help/LearnScrummyNoticeCard';
import { fantasyAnalytics } from '../services/analytics/fantasyAnalytics';
import { useHideTopNavBar } from '../hooks/navigation/useNavigationBars';
import LeagueGroupScreenHeader from '../components/fantasy-league/LeagueGroupScreenHeader';

export function FantasyLeagueScreen() {
  const { leagueId } = useParams();

  return (
    <FantasyLeagueGroupDataProvider leagueId={leagueId}>
      <Content />
    </FantasyLeagueGroupDataProvider>
  );
}

function Content() {

  /** Auto Hides Top Bar to Maximise screen space */
  useHideTopNavBar();

  const { league, userMemberRecord } = useFantasyLeagueGroup();

  const [journey] = useQueryState('journey');

  let initialTabKey = journey === 'team-creation' ? 'my-team' : undefined;
  initialTabKey = journey === 'my-team' ? 'my-team' : initialTabKey;

  // Hooks must be declared before any early returns
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fantasyAnalytics.trackVisitedLeagueScreen(league?.id);
  }, [league?.id]);

  if (!league && !league) {
    return <ErrorState error="Whoops" message="Fantasy League was not found" />;
  }

  const headerItems: TabViewHeaderItem[] = [
    {
      label: 'Overview',
      tabKey: 'overview',
      className: 'w-fit',
    },
    {
      label: 'Standings',
      tabKey: 'standings',
      className: 'w-fit',
    },

    {
      label: 'My Team',
      tabKey: 'my-team',
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
    <PageView className="dark:text-white bg-white dark:bg-[#0D0D0D] flex flex-col gap-4">
      
      <LeagueGroupScreenHeader 
        isEditing={isEditing}
      />

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
        pillTabRowClassName='px-4'
      >
        <TabViewPage tabKey="my-team">
          <MyTeams onEditChange={setIsEditing} />
        </TabViewPage>

        <TabViewPage tabKey="standings" className='px-4'>
          <LeagueStandings />
        </TabViewPage>

        <TabViewPage tabKey="info" className='px-4' >
          <LeagueInfoTab />
        </TabViewPage>

        <TabViewPage tabKey="fixtures" className='px-4' >
          <LeagueFixturesTab />
        </TabViewPage>

        <TabViewPage tabKey="commissioner" className='px-4' >
          <LeagueCommissionerTab />
        </TabViewPage>

        <TabViewPage tabKey="overview" className='px-4' >
          <LeagueOverviewTab />
        </TabViewPage>
      </PilledTabView>
    </PageView>
  );
}
