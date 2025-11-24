import { useParams } from 'react-router-dom';
import { IFixture } from '../types/games';
import { fixtureSummary } from '../utils/fixtureUtils';
import FixtureScreenOverview from '../components/fixtures/FixtureScreenOverview';
import useSWR from 'swr';
import { gamesService } from '../services/gamesService';
import { LoadingState } from '../components/ui/LoadingState';
import FixtureBoxscoreTab from '../components/fixtures/FixtureBoxscoreTab';
import { boxScoreService } from '../services/boxScoreService';
import { FixtureScreenHeader } from '../components/fixtures/FixtureScreenHeader';
import TabView, { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import FixtureHeadToHeadStats from '../components/fixtures/FixtureHeadToHeadStats';
import PageView from './PageView';
import FixtureRosters from '../components/fixtures/FixtureRosters';
import FixtureChat from '../components/fixtures/FixtureChat';
import GameHighlightsCard from '../components/video/GameHighlightsCard';
import { ProMotmVotingBox } from '../components/pro/motm';
import ProFixtureVotingBox from '../components/fixtures/voting/ProFixtureVotingBox';
import { ErrorState } from '../components/ui/ErrorState';
import FixtureHero from '../components/fixtures/FixtureHero';
import { Activity } from '../components/shared/Activity';

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
      className: "flex-1"
    },
    {
      label: 'Boxscore',
      tabKey: 'athletes-stats',
      disabled: !sportActions || sportActions.length === 0,
      className: "flex-1"
    },
    {
      label: 'Team Stats',
      tabKey: 'team-stats',
      disabled: !teamActions || teamActions.length === 0 || !gameKickedOff,
      className: "flex-1"
    },
    {
      label: 'Top Player',
      tabKey: 'motm',
      disabled: true,
      className: "flex-1"
    },
    {
      label: 'Chat',
      tabKey: 'chat',
      disabled: true,
      className: "flex-1"
    },
    {
      label: 'Team Rosters',
      tabKey: 'rosters',
      disabled: false,
      className: "flex-1"
    },
  ];

  return (
    <div className="dark:text-white w-full flex flex-col">



      {!loadingSportsActions && (
        <PageView className="w-full">
          <FixtureHero fixture={fixture} />
          <FixtureScreenHeader fixture={fixture} />

          <TabView tabHeaderItems={tabItems}>

            <TabViewPage className="flex w-full flex-col gap-5" tabKey="athletes-stats">
              <GameHighlightsCard link={fixture.highlights_link} />

              <Activity mode={sportActions && (sportActions?.length ?? 0) > 0 ? "visible" : "hidden"} >
                <FixtureBoxscoreTab sportActions={sportActions || []} fixture={fixture} />
              </Activity>

            </TabViewPage>

            <TabViewPage className="flex flex-col gap-4 p-2" tabKey="kick-off">
              <FixtureScreenOverview fixture={fixture} />
              <GameHighlightsCard link={fixture.highlights_link} />
              <div className="flex flex-col">
                <p className="font-bold">Predictions</p>
                <ProFixtureVotingBox
                  className="border border-slate-300 px-4 py-6 rounded-xl bg-white dark:border-slate-700 dark:bg-slate-800/40"
                  fixture={fixture}
                />
              </div>
            </TabViewPage>

            <TabViewPage className="flex flex-col gap-5 p-2" tabKey="team-stats">
              {teamActions && gameKickedOff && (
                <FixtureHeadToHeadStats teamActions={teamActions} fixture={fixture} />
              )}
            </TabViewPage>

            <TabViewPage tabKey="motm">
              <ProMotmVotingBox fixture={fixture} />
            </TabViewPage>

            <TabViewPage tabKey="rosters">{<FixtureRosters fixture={fixture} />}</TabViewPage>

            <TabViewPage tabKey="chat">
              <FixtureChat fixture={fixture} />
            </TabViewPage>
          </TabView>
        </PageView>
      )}

      <div className="flex flex-col p-4 gap-5">
        {/* Overview Component */}
        {loadingSportsActions && <LoadingState />}
      </div>
    </div>
  );
}