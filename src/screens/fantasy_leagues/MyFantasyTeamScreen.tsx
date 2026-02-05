import PageView from '../../components/ui/containers/PageView';
import MyTeamModeSelector from '../../components/my_fantasy_team/MyTeamModeSelector';
import LearnScrummyNoticeCard from '../../components/branding/help/LearnScrummyNoticeCard';
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
    <TeamHistoryProvider
      user={authUser}
      loadingFallback={<LeagueScreenLoadingSkeleton />}
    >
      <Content />
    </TeamHistoryProvider>
  );
}

function Content() {

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
