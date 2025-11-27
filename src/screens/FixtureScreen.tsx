import { useParams } from 'react-router-dom';
import { IFixture } from '../types/games';
import { fixtureSummary } from '../utils/fixtureUtils';
import FixtureOverviewTab from '../components/fixtures/fixture_screen/FixtureOverviewTab';
import useSWR from 'swr';
import { gamesService } from '../services/gamesService';
import { LoadingState } from '../components/ui/LoadingState';
import { boxScoreService } from '../services/boxScoreService';
import { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import PageView from './PageView';
import FixtureChat from '../components/fixtures/FixtureChat';
import GameHighlightsCard from '../components/video/GameHighlightsCard';
import { ProMotmVotingBox } from '../components/pro/motm';
import { ErrorState } from '../components/ui/ErrorState';
import { Activity } from '../components/shared/Activity';
import PilledTabView from '../components/shared/tabs/PilledTabView';
import FixtureBoxscoreTab from '../components/fixtures/fixture_screen/FixtureBoxscoreTab';
import FixtureHeadToHeadStats from '../components/fixtures/fixture_screen/FixtureHeadToHeadStats';
import FixtureHero from '../components/fixtures/fixture_screen/FixtureHero';
import { FixtureStickyHeader } from '../components/fixtures/fixture_screen/FixtureStickyHeader';
import FixtureRostersTab from '../components/fixtures/fixture_screen/FixtureRostersTab';
import { useHideBottomNavBar } from '../hooks/navigation/useNavigationBars';

export default function FixtureScreen() {

  const { fixtureId } = useParams();

  const fixtureKey = fixtureId ? `fixture/${fixtureId}` : null;
  const { data: fetchedFixture, isLoading: loadingFixture } = useSWR(fixtureKey, () =>
    gamesService.getGameById(fixtureId ?? '')
  );

  const sportsActionsKey = fixtureId ? `fixtures/${fixtureId}/sports-actions` : null;
  const { data: sportActions, isLoading: loadingSportsActions } = useSWR(sportsActionsKey, () =>
    boxScoreService.getSportActionsByGameId(fixtureId ?? '')
  );

  useHideBottomNavBar();

  const teamActionsKey = fixtureId ? `fixtures/${fixtureId}/team-actions` : null;
  const { data: teamActions, isLoading: loadingTeamActions } = useSWR(teamActionsKey, () =>
    gamesService.getGameTeamActions(fixtureId ?? '')
  );

  const isLoading = loadingFixture || loadingSportsActions || loadingTeamActions;

  if (isLoading) return <LoadingState />;

  if (!fetchedFixture)
    return <ErrorState error='Whoops!' message="Failed to load match information" />;

  if (!fixtureId) return <ErrorState message="Match was not found" />;

  const fixture = fetchedFixture as IFixture;
  const { gameKickedOff } = fixtureSummary(fixture);

  const tabItems: TabViewHeaderItem[] = [
    {
      label: 'Kick Off',
      tabKey: 'kick-off',
      disabled: false,
      className: ""
    },
    {
      label: 'Boxscore',
      tabKey: 'athletes-stats',
      disabled: !sportActions || sportActions.length === 0,
      className: ""
    },
    {
      label: 'Team Stats',
      tabKey: 'team-stats',
      disabled: !teamActions || teamActions.length === 0 || !gameKickedOff,
      className: ""
    },
    {
      label: 'Top Player',
      tabKey: 'motm',
      disabled: true,
      className: ""
    },
    {
      label: 'Chat',
      tabKey: 'chat',
      disabled: true,
      className: ""
    },
    {
      label: 'Team Rosters',
      tabKey: 'rosters',
      disabled: false,
      className: ""
    },
  ];

  return (
    <div className="dark:text-white w-full flex flex-col">



      {!loadingSportsActions && (
        <PageView className="w-full"  >
          <FixtureHero fixture={fixture} />
          <FixtureStickyHeader fixture={fixture} />

          <PilledTabView pillTabRowClassName={"px-4"} className='' tabHeaderItems={tabItems}>

            <TabViewPage className="flex w-full flex-col gap-5" tabKey="athletes-stats">
              <GameHighlightsCard link={fixture.highlights_link} />

              <Activity mode={sportActions && (sportActions?.length ?? 0) > 0 ? "visible" : "hidden"} >
                <FixtureBoxscoreTab sportActions={sportActions || []} fixture={fixture} />
              </Activity>

            </TabViewPage>

            <TabViewPage className="flex flex-col gap-4 px-4" tabKey="kick-off">
              <FixtureOverviewTab fixture={fixture} />
            </TabViewPage>

            <TabViewPage className="flex flex-col gap-5" tabKey="team-stats">
              {teamActions && gameKickedOff && (
                <FixtureHeadToHeadStats teamActions={teamActions} fixture={fixture} />
              )}
            </TabViewPage>

            <TabViewPage tabKey="motm">
              <ProMotmVotingBox fixture={fixture} />
            </TabViewPage>

            <TabViewPage className='p-0 px-0'  tabKey="rosters">
              <FixtureRostersTab fixture={fixture} />
            </TabViewPage>

            <TabViewPage tabKey="chat">
              <FixtureChat fixture={fixture} />
            </TabViewPage>
          </PilledTabView>
        </PageView>
      )}

      <div className="flex flex-col p-4 gap-5">
        {/* Overview Component */}
        {loadingSportsActions && <LoadingState />}
      </div>
    </div>
  );
}