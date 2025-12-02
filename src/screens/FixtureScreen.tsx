import { useParams } from 'react-router-dom';
import FixtureOverviewTab from '../components/fixtures/fixture_screen/FixtureOverviewTab';
import useSWR from 'swr';
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
import FixtureH2HTab from '../components/fixtures/fixture_screen/FixtureH2HTab';
import FixtureHero from '../components/fixtures/fixture_screen/FixtureHero';
import { FixtureStickyHeader } from '../components/fixtures/fixture_screen/FixtureStickyHeader';
import FixtureRostersTab from '../components/fixtures/fixture_screen/rosters/FixtureRostersTab';
import { useHideBottomNavBar } from '../hooks/navigation/useNavigationBars';
import FixtureStandingsTab from '../components/fixtures/fixture_screen/FixtureStandingsTab';
import SportActionsDefinitionsProvider from '../components/stats/SportActionsDefinitionsProvider';
import { FixtureScreenProvider } from '../providers/fixtures/FixtureScreenProvider';
import { useFixtureScreen } from '../hooks/fixtures/useFixture';
import PlayerFixtureModal from '../components/fixtures/fixture_screen/PlayerFixtureModal';
import PlayerProfileModal from '../components/player/PlayerProfileModal';

export default function FixtureScreen() {

  const { fixtureId } = useParams();

  return (
    <FixtureScreenProvider
      fixtureId={fixtureId}
    >
      <SportActionsDefinitionsProvider>
        <Content />
      </SportActionsDefinitionsProvider>
    </FixtureScreenProvider>
  )
}

function Content() {

  const { fixture, showProfileModal, selectedPlayer, showPlayerMatchModal, closePlayerMatchModal, closePlayerProfileModal } = useFixtureScreen();
  const fixtureId = fixture?.game_id;

  const sportsActionsKey = fixtureId ? `fixtures/${fixtureId}/sports-actions` : null;
  const { data: sportActions, isLoading: loadingSportsActions } = useSWR(sportsActionsKey, () =>
    boxScoreService.getSportActionsByGameId(fixtureId ?? '')
  );

  useHideBottomNavBar();

  const isLoading = loadingSportsActions;

  if (isLoading) return <LoadingState />;

  if (!fixture)
    return <ErrorState error='Whoops!' message="Failed to load match information" />;

  if (!fixtureId) return <ErrorState message="Match was not found" />;

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
      label: 'Head to Head',
      tabKey: 'h2h',
      disabled: false,
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

    {
      label: 'Standings',
      tabKey: 'standings',
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

            <TabViewPage className="flex flex-col gap-5" tabKey="h2h">
              <FixtureH2HTab fixture={fixture} />
            </TabViewPage>

            <TabViewPage tabKey="motm">
              <ProMotmVotingBox fixture={fixture} />
            </TabViewPage>

            <TabViewPage className='p-0 px-0' tabKey="rosters">
              <FixtureRostersTab fixture={fixture} />
            </TabViewPage>

            <TabViewPage tabKey="chat">
              <FixtureChat fixture={fixture} />
            </TabViewPage>

            <TabViewPage tabKey="standings" className='px-4'>
              <FixtureStandingsTab fixture={fixture} />
            </TabViewPage>
          </PilledTabView>
        </PageView>
      )}

      {showPlayerMatchModal && selectedPlayer && (
        <PlayerFixtureModal
          fixture={fixture}
          player={selectedPlayer}
          isOpen={showPlayerMatchModal}
          onClose={closePlayerMatchModal}
        />
      )}

      {showProfileModal && selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          isOpen={showProfileModal}
          onClose={closePlayerProfileModal}
        />
      )}

      <div className="flex flex-col p-4 gap-5">
        {/* Overview Component */}
        {loadingSportsActions && <LoadingState />}
      </div>
    </div>
  );
}