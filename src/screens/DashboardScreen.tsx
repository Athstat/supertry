import PageView from '../components/ui/containers/PageView';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import { useFantasySeasons } from '../hooks/dashboard/useFantasySeasons';
import DashboardHero from '../components/dashboard/hero/DashboardHero';
import DashboardAdSection from '../components/dashboard/banners/DashboardAdSection';
import FantasyTopPerformersCard from '../components/dashboard/rankings/FantasyTopPerformersCard';
import { Activity, Fragment } from 'react';
import { twMerge } from 'tailwind-merge';
import DominateScrumCard from '../components/dashboard/DominateScrumCard';
import PickemCtaCard from '../components/dashboard/PickemCtaCard';
import { DashboardHeroLoadingSkeleton } from '../components/dashboard/hero/DashboardHeroSections';
import RoundedCard from '../components/ui/cards/RoundedCard';
import OnboardingChecker from '../components/dashboard/OnboardingChecker';
import CreateTeamTutorialTrigger from '../components/tutorials/CreateTeamTutorialTrigger';


export function DashboardScreen() {

  const { isLoading } = useFantasySeasons();

  /** Hook for temporal fix, that prompts user to enable
   * notification if they havem't already seen a message to do so */
  useTempEnableNotificationAlert();


  return (

    <Fragment>

      <Activity mode={isLoading ? "visible" : "hidden"} >
        <LoadingSkeleton />
      </Activity>

      <Activity mode={isLoading ? "hidden" : "visible"} >
        <PageView className={twMerge(
          "flex flex-col bg-[#F0F3F7] dark:bg-transparent space-y-4",
        )}>

          <ClaimAccountNoticeCard />

          <DashboardHero/>
          <DominateScrumCard className='p-4 lg:p-6 m-4' />
          <DashboardAdSection />
          
          <FantasyTopPerformersCard className='px-2 m-4' />

          <PickemCtaCard className='p-4 m-4' />

          <OnboardingChecker />
          <CreateTeamTutorialTrigger />

        </PageView>
      </Activity>
    </Fragment>
  );
}

/** Renders loading skeleton for dashboard */
function LoadingSkeleton() {
  return (
    <PageView className="flex flex-col space-y-4 py-4">
      <div className="flex flex-col gap-2">
        <DashboardHeroLoadingSkeleton />

        <div className='w-full p-4' >
          <RoundedCard className="w-full bg-slate-200 dark:bg-gray-800 h-[100px] border-none animate-pulse" />
        </div>

        <div>
          <RoundedCard className="w-full rounded-none bg-slate-200 dark:bg-gray-800 h-[160px] border-none animate-pulse" />
        </div>

        <div className='p-4'>
          <RoundedCard className="w-full bg-slate-200 dark:bg-gray-800 h-[450px] border-none animate-pulse" />
        </div>

        <div className='p-4'>
          <RoundedCard className="w-full bg-slate-200 dark:bg-gray-800 h-[150px] border-none animate-pulse" />
        </div>
      </div>
    </PageView>
  );
}
