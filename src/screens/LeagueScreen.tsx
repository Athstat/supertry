import { useParams } from 'react-router-dom';
import FantasyLeagueGroupDataProvider from '../components/fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../hooks/leagues/useFantasyLeagueGroup';
import PageView from './PageView';
import { ErrorState } from '../components/ui/ErrorState';
import MyTeamsTab from '../components/fantasy-leagues/MyTeamTab';
import { useEffect } from 'react';
import LearnScrummyNoticeCard from '../components/branding/help/LearnScrummyNoticeCard';
import { fantasyAnalytics } from '../services/analytics/fantasyAnalytics';
import { useHideBottomNavBar, useHideTopNavBar } from '../hooks/navigation/useNavigationBars';
import LeagueGroupScreenHeader from '../components/fantasy-league/LeagueGroupScreenHeader';
import RoundedCard from '../components/shared/RoundedCard';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../types/constants';

export function FantasyLeagueScreen() {
  const { leagueId } = useParams();

  return (
    <FantasyLeagueGroupDataProvider loadingFallback={<LoadingSkeleton />} leagueId={leagueId}>
      <Content />
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
    return <ErrorState error="Whoops" message="Fantasy League was not found" />;
  }

  return (
    <PageView className={twMerge(
      "dark:text-white flex flex-col gap-4",
      AppColours.BACKGROUND
    )}>

      <LeagueGroupScreenHeader />
      <LearnScrummyNoticeCard />
      <MyTeamsTab />

    </PageView>
  );
}

function LoadingSkeleton() {
  useHideTopNavBar();
  useHideBottomNavBar();

  return (
    <PageView className="p-4 animate-pulse overflow-hidden flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <RoundedCard className="border-none w-[30px] h-[25px] " />
          <RoundedCard className="border-none w-[100px] h-[25px] " />
        </div>

        <RoundedCard className="border-none w-[100px] h-[40px] " />
      </div>

      <div className="flex flex-row items-center gap-2">
        <RoundedCard className="border-none w-[100px] h-[25px] " />
        <RoundedCard className="border-none w-[100px] h-[25px] " />
        <RoundedCard className="border-none w-[90px] h-[25px] " />
        <RoundedCard className="border-none w-[70px] h-[25px] " />
      </div>

      <div className="flex flex-col items-center gap-2">
        <RoundedCard className="border-none w-full h-[100px] " />
        <RoundedCard className="border-none w-full h-[500px] " />
        <RoundedCard className="border-none w-full h-[40px] " />
      </div>
    </PageView>
  );
}
