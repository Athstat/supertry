import PageView from './PageView';
import { useNavigate } from 'react-router-dom';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import RoundedCard from '../components/shared/RoundedCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import { useDashboard } from '../hooks/dashboard/useDashboard';
import DashboardHero from '../components/dashboard/DashboardHero';
import SchoolRugbyBanner from '../components/dashboard/SchoolRugbyBanner';
import FantasyPointsScoredPlayerList from '../components/dashboard/rankings/FantasyPointsPlayerList';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import DashboardDataProvider from '../components/dashboard/provider/DashboardDataProvider';
import DominateScrumCard from '../components/dashboard/DominateScrumCard';

/** Renders a Dashboard Screen */
export function DashboardScreen() {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
}


function DashboardContent() {
  const navigate = useNavigate();
  const { currentSeason, selectedSeason } = useDashboard();

  /** Hook for temporal fix, that prompts user to enable
   * notification if they havem't already seen a message to do so */
  useTempEnableNotificationAlert();

  // Use selected season or fall back to current season
  const displaySeason = useMemo(() => {
    return selectedSeason || currentSeason;
  }, [selectedSeason, currentSeason]);


  return (
    <PageView className={twMerge(
      "flex flex-col bg-[#F0F3F7] dark:bg-transparent space-y-4",
    )}>

      <ClaimAccountNoticeCard />

      <DashboardHero season={displaySeason} />
      <DominateScrumCard className='p-4 lg:p-6 m-4' />
      <SchoolRugbyBanner />

      <FantasyPointsScoredPlayerList className='px-2 m-4' />


      <div className="p-4" style={{ marginTop: 8 }}>
        {/* Make your match predictions */}
        <RoundedCard className="flex bg-[#F0F3F7] flex-col gap-2 pt-5 pb-5 pl-2 pr-2">
          <h1 className="font-bold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Make your match predictions</h1>
          <div className="flex flex-row gap-2 sm:gap-4 items-center">
            <p className="text-xs text-gray-600 dark:text-gray-300 flex-1">
              Predict the results of all the upcoming matches to maximize your fantasy points this
              week.
            </p>
            <button
              onClick={() => navigate('/fixtures?view=pickem')}
              className="px-2 py-2.5 rounded-md bg-transparent border border-[#011E5C] dark:border-white font-semibold text-xs text-[#011E5C] dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
            >
              Pick'em
            </button>
          </div>
        </RoundedCard>
      </div>

      {/* Weekly Leaderboards with tabs */}
      {/* <WeeklyLeaderboards season={displaySeason} /> */}
    </PageView>
  );
}