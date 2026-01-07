import { useParams } from 'react-router-dom';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import PageView from '../../components/ui/containers/PageView';
import MyTeamModeSelector from '../../components/my_fantasy_team/MyTeamModeSelector';
import { useEffect } from 'react';
import LearnScrummyNoticeCard from '../../components/branding/help/LearnScrummyNoticeCard';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';
import { useHideBottomNavBar, useHideTopNavBar } from '../../hooks/navigation/useNavigationBars';
import MyFantasyTeamScreenHeader from '../../components/fantasy_league/MyFantasyTeamScreenHeader';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../../types/constants';
import TeamHistoryProvider from '../../providers/fantasy_teams/TeamHistoryProvider';
import { useAuth } from '../../contexts/AuthContext';
import FantasyLeagueGroupDataProvider from '../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider';
import PitchViewLoadingSkeleton from '../../components/my_fantasy_team/PitchViewLoadingSkeleton';
import RoundedCard from '../../components/ui/cards/RoundedCard';
import ErrorCard from '../../components/ui/cards/ErrorCard';

/** Renders my fantasy team screen */
export function MyFantasyTeamScreen() {
  const { leagueId } = useParams();
  const { authUser } = useAuth();

  return (
    <FantasyLeagueGroupDataProvider
      loadingFallback={<LeagueScreenLoadingSkeleton />}
      leagueId={leagueId}
      fetchMembers={false}
    >
      <TeamHistoryProvider user={authUser} loadingFallback={<LeagueScreenLoadingSkeleton />} >
        <Content />
      </TeamHistoryProvider>
    </FantasyLeagueGroupDataProvider>
  );
}

function Content() {

  /** Auto Hides Top Bar to Maximise screen space */
  useHideTopNavBar();
  useHideBottomNavBar();

  const { league, isLoading } = useFantasyLeagueGroup();

  useEffect(() => {
    fantasyAnalytics.trackVisitedLeagueScreen(league?.id);
  }, [league?.id]);

  if (!isLoading && !league) {
    return (
      <ErrorCard
        title="Whoops"
        message="Fantasy League was not found"
      />
    )
  }

  return (
    <PageView className={twMerge(
      "dark:text-white flex flex-col gap-4",
      AppColours.BACKGROUND
    )}>

      <MyFantasyTeamScreenHeader />
      <LearnScrummyNoticeCard />
      <MyTeamModeSelector />

    </PageView>
  );
}

function LeagueScreenLoadingSkeleton() {
  useHideTopNavBar();
  useHideBottomNavBar();

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
