import PageView from './PageView';
import { useNavigate } from 'react-router-dom';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import RoundedCard from '../components/shared/RoundedCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import { useDashboard } from '../hooks/dashboard/useDashboard';
import TeamPlayersPrefetchProvider from '../providers/TeamPlayersPrefetchProvider';
import DashboardHero from '../components/dashboard/DashboardHero';
import WeeklyLeaderboards from '../components/dashboard/WeeklyLeaderboards';
import { useAtomValue } from 'jotai';
import { dashboardAtoms } from '../state/dashboard/dashboard.atoms';
import { useMemo } from 'react';

export function DashboardScreen() {
  return (
    <TeamPlayersPrefetchProvider>
      <DashboardContent />
    </TeamPlayersPrefetchProvider>
  );
}

function DashboardContent() {
  const navigate = useNavigate();
  const { currentSeason } = useDashboard();
  const selectedSeason = useAtomValue(dashboardAtoms.selectedDashboardSeasonAtom);

  /** Hook for temporal fix, that prompts user to enable
   * notification if they havem't already seen a message to do so */
  useTempEnableNotificationAlert();

  const handleBannerClick = () => {
    navigate('/leagues');
  };

  // Use selected season or fall back to current season
  const displaySeason = useMemo(() => {
    return selectedSeason || currentSeason;
  }, [selectedSeason, currentSeason]);

  return (
    <PageView className="flex flex-col space-y-4 p-4">
      <ClaimAccountNoticeCard />

      {/* Dashboard Hero - Shows team stats or first-time user view */}
      <DashboardHero season={displaySeason} />

      {/* <FeaturedFantasyLeagueGroups /> */}

      {/* Dominate the SCRUM */}
      <RoundedCard className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-lg">Dominate the SCRUM</h1>
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Create your own league, or join one. Challenge your friends, invite your crew and see
              who really rules the game!
            </p>
            <PrimaryButton
              className="h-10 whitespace-nowrap w-fit flex-shrink-0"
              onClick={handleBannerClick}
            >
              Start a League
            </PrimaryButton>
          </div>
        </div>
      </RoundedCard>

      {/* Make your match predictions */}
      <RoundedCard className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-lg">Make your match predictions</h1>
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Predict the results of all the upcoming matches to maximize your fantasy points this
              week.
            </p>
            <PrimaryButton
              className="h-10 whitespace-nowrap w-fit flex-shrink-0"
              onClick={() => navigate('/fixtures?view=pickem')}
            >
              Predict now
            </PrimaryButton>
          </div>
        </div>
      </RoundedCard>

      {/* What's Going On in Schools Rugby? */}
      <div className="text-center py-4">
        <h2 className="font-bold text-lg mb-2">What's Going On in Schools Rugby?</h2>
        <button
          onClick={() => navigate('/fixtures?sc=SBR')}
          className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline font-medium"
        >
          View fixtures
        </button>
      </div>

      {/* Weekly Leaderboards with tabs */}
      <WeeklyLeaderboards season={displaySeason} />
    </PageView>
  );
}
