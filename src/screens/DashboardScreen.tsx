import PageView from './PageView';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import { useDashboard } from '../hooks/dashboard/useDashboard';
import DashboardHero from '../components/dashboard/DashboardHero';
import SchoolRugbyBanner from '../components/dashboard/SchoolRugbyBanner';
import FantasyPointsScoredPlayerList from '../components/dashboard/rankings/FantasyPointsPlayerList';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import DashboardDataProvider from '../components/dashboard/provider/DashboardDataProvider';
import DominateScrumCard from '../components/dashboard/DominateScrumCard';
import PickemCtaCard from '../components/dashboard/PickemCtaCard';

/** Renders a Dashboard Screen */
export function DashboardScreen() {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
}


function DashboardContent() {

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

      <PickemCtaCard className='p-4 m-4' />

    </PageView>
  );
}