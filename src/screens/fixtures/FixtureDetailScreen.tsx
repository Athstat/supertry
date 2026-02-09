import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import FixtureBoxscoreTab from '../../components/fixture/fixture_screen/FixtureBoxscoreTab';
import FixtureH2HTab from '../../components/fixture/fixture_screen/FixtureH2HTab';
import FixtureHero from '../../components/fixture/fixture_screen/FixtureHero';
import FixtureOverviewTab from '../../components/fixture/fixture_screen/FixtureOverviewTab';
import FixtureStandingsTab from '../../components/fixture/fixture_screen/FixtureStandingsTab';
import FixtureRostersTab from '../../components/fixture/fixture_screen/rosters/FixtureRostersTab';
import { ProMotmVotingBox } from '../../components/pickem/motm';
import PlayerProfileModal from '../../components/player/PlayerProfileModal';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import PilledTabView from '../../components/ui/tabs/PilledTabView';
import { TabViewHeaderItem, TabViewPage } from '../../components/ui/tabs/TabView';
import { useFixtureScreen } from '../../hooks/fixtures/useFixture';
import { useHideBottomNavBar } from '../../hooks/navigation/useNavigationBars';
import { FixtureScreenProvider } from '../../providers/fixtures/FixtureScreenProvider';
import { boxScoreService } from '../../services/boxScoreService';
import PageView from '../../components/ui/containers/PageView';
import ErrorCard from '../../components/ui/cards/ErrorCard';
import { Activity } from 'react';
import PlayerFixtureModal from '../../components/fixture/player_fixture_modal/PlayerFixtureModal';

export default function FixtureDetailScreen() {

  const { fixtureId } = useParams();

  return (
    <FixtureScreenProvider
      fixtureId={fixtureId}
    >
        <Content />
    </FixtureScreenProvider>
  )
}

function Content() {

  const { fixture, showProfileModal, selectedPlayer, showPlayerMatchModal, closePlayerMatchModal, closePlayerProfileModal } = useFixtureScreen();
  const fixtureId = fixture?.game_id;

  const sportsActionsKey = fixtureId ? `/fixtures/${fixtureId}/boxscore/sports-actions` : null;

  const { data: sportActions, isLoading: loadingSportsActions } = useSWR(sportsActionsKey, () =>
    boxScoreService.getSportActionsByGameId(fixtureId ?? '')
  , {
    refreshInterval: 1000 * 2 // 2 minutes
  });

  useHideBottomNavBar();

  const isLoading = loadingSportsActions;

  if (isLoading) return <LoadingIndicator />;

  if (!fixture)
    return <ErrorCard error='Whoops!' message="Failed to load match information" />;

  if (!fixtureId) return <ErrorCard message="Match was not found" />;

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
      label: 'Team Lineups',
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
          {/* <FixtureStickyHeader fixture={fixture} /> */}

          <PilledTabView pillTabRowClassName={"px-4"} className='' tabHeaderItems={tabItems}>

            <TabViewPage className="flex w-full flex-col gap-5" tabKey="athletes-stats">
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
        {loadingSportsActions && <LoadingIndicator />}
      </div>
    </div>
  );
}
