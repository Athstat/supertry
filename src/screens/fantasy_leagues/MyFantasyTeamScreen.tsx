import PageView from '../../components/ui/containers/PageView';
import MyTeamModeSelector from '../../components/my_fantasy_team/MyTeamModeSelector';
import { useHideBottomNavBar, useHideTopNavBar } from '../../hooks/navigation/useNavigationBars';
import MyFantasyTeamScreenHeader from '../../components/fantasy_league/MyFantasyTeamScreenHeader';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../../types/constants';
import TeamHistoryProvider from '../../providers/fantasy_teams/TeamHistoryProvider';
import PitchViewLoadingSkeleton from '../../components/my_fantasy_team/PitchViewLoadingSkeleton';
import RoundedCard from '../../components/ui/cards/RoundedCard';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useQueryValue } from '../../hooks/web/useQueryState';
import { useEffect } from 'react';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useTeamHistory } from '../../hooks/fantasy/useTeamHistory';
import RoundFixturesProvider from '../../providers/fixtures/RoundFixturesProvider';
import TeamHistoryBar from '../../components/my_fantasy_team/TeamHistoryBar';
import { IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { ISeasonRound } from '../../types/fantasy/fantasySeason';
import { getMyTeamViewMode } from '../../utils/fantasy/myteamUtils';
import { isSeasonRoundTeamsLocked } from '../../utils/leaguesUtils';
import MyTeamProvider from '../../contexts/fantasy/my_team/MyTeamContext';
import MyTeamPitch from '../../components/my_fantasy_team/MyTeamPitch';
import MyTeamHeader from '../../components/my_fantasy_team/MyTeamHeader';
import MyTeamBenchDrawer from '../../components/my_fantasy_team/MyTeamBenchDrawer';
import MyTeamModals from '../../components/my_fantasy_team/MyTeamModals';
import { useSeasonRoundFixtures } from '../../hooks/fixtures/useProFixtures';
import CreateTeamProvider from '../../providers/fantasy_teams/CreateTeamProvider';
import CreateTeamHeader from '../../components/my_fantasy_team/CreateTeamHeader';

/** Renders my fantasy team screen */
export function MyFantasyTeamScreen() {

  useHideTopNavBar();
  useHideBottomNavBar();

  const { authUser } = useAuth();

  const { getSeasonById, setSelectedSeason } = useFantasySeasons();
  const seasonId = useQueryValue('season_id')

  useEffect(() => {
    if (seasonId) {
      const season = getSeasonById(seasonId);
      if (season) {
        setSelectedSeason(season);
      }
    }

  }, [getSeasonById, seasonId, setSelectedSeason]);

  return (
    <PageView className={twMerge(
      "dark:text-white flex flex-col gap-2",
      AppColours.BACKGROUND,
    )}>
      <TeamHistoryProvider
        user={authUser}
        loadingFallback={<LeagueScreenLoadingSkeleton />}
      >
        <MyFantasyTeamScreenHeader />
        <TeamHistoryBar />
        <Content />
      </TeamHistoryProvider>
    </PageView >
  );
}

function Content() {
  const { round, roundTeam, manager } = useTeamHistory();
  const isLocked = round && isSeasonRoundTeamsLocked(round);
  const viewMode = getMyTeamViewMode(round, roundTeam, isLocked);
  const { isLoading, fixtures } = useSeasonRoundFixtures(round?.season, round?.round_number);

  if (viewMode === "pitch-view" && roundTeam && manager) {
    return (
      <MyTeamProvider
        roundGames={fixtures}
        round={round}
        team={roundTeam}
        manager={manager}
        isReadOnly={false}
      >
        <MyTeamHeader />
        <MyTeamPitch />
        <MyTeamBenchDrawer />
        <MyTeamModals />
      </MyTeamProvider>
    )
  }

  if (viewMode === "create-team" && round) {
    return (
      <CreateTeamProvider
        roundGames={fixtures}
        leagueRound={round}
      >
        <CreateTeamHeader />
        <MyTeamPitch />
        <MyTeamBenchDrawer />
        <MyTeamModals />
      </CreateTeamProvider>
    )
  }
}

function LeagueScreenLoadingSkeleton() {

  return (
    <PageView className="animate-pulse overflow-hidden flex flex-col gap-4">

      <div className='px-4' >
        <div className="flex flex-row pt-4 relative items-center justify-center">

          <RoundedCard className="border-none absolute left-0 rounded-full w-[30px] h-[30px] " />
          <RoundedCard className="border-none w-[100px] h-[30px] " />
          <RoundedCard className="border-none absolute w-[100px] right-0 h-[30px] " />
        </div>
      </div>

      <PitchViewLoadingSkeleton />
    </PageView>
  );
}

