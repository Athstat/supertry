import PageView from './PageView';
import { useNavigate } from 'react-router-dom';
import FeaturedFantasyLeagueGroups from './FeaturedFantasyLeagueGroups';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import RoundedCard from '../components/shared/RoundedCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import SportActionRankingsList from '../components/dashboard/rankings/SportActionRankingCard';
import { Crown, Home } from 'lucide-react';
import { useDashboard } from '../hooks/dashboard/useDashboard';
import { abbreviateSeasonName } from '../components/players/compare/PlayerCompareSeasonPicker';
import TeamPlayersPrefetchProvider from '../providers/TeamPlayersPrefetchProvider';
import DashboardHero from '../components/dashboard/DashboardHero';
import WeeklyLeaderboards from '../components/dashboard/WeeklyLeaderboards';
import SchoolRugbyBanner from '../components/dashboard/SchoolRugbyBanner';
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
    <PageView className="flex flex-col space-y-4">
      <ClaimAccountNoticeCard />

      {/* Dashboard Hero - Shows team stats or first-time user view */}
      <DashboardHero season={displaySeason} />

      {/* <FeaturedFantasyLeagueGroups /> */}

      {/* Dominate the SCRUM */}
      <RoundedCard className="flex flex-col sm:flex-row gap-4 p-5 items-start sm:items-end">
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="font-bold text-lg text-[#011E5C] dark:text-white">Dominate the scrum</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create your own league, or join one. Challenge your friends, invite your crew and see
            who really rules the game!
          </p>
        </div>
        <button
          onClick={handleBannerClick}
          className="px-6 py-2.5 rounded-md bg-transparent border border-[#011E5C] dark:border-white font-semibold text-sm text-[#011E5C] dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
        >
          Start A League
        </button>
      </RoundedCard>

      {/* School Rugby Banner */}
      <SchoolRugbyBanner />

      {/* Make your match predictions */}
      <RoundedCard className="flex flex-col sm:flex-row gap-4 p-5 items-start sm:items-end">
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="font-bold text-lg text-[#011E5C] dark:text-white">Make your match predictions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Predict the results of all the upcoming matches to maximize your fantasy points this
            week.
          </p>
        </div>
        <button
          onClick={() => navigate('/fixtures?view=pickem')}
          className="px-6 py-2.5 rounded-md bg-transparent border border-[#011E5C] dark:border-white font-semibold text-sm text-[#011E5C] dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
        >
          Pick'em
        </button>
      </RoundedCard>

      {/* Weekly Leaderboards with tabs */}
      <WeeklyLeaderboards season={displaySeason} />
    </PageView>
  );
}
