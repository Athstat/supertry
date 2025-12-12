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
import SchoolRugbyBanner from '../components/dashboard/SchoolRugbyBanner';
import FantasyPointsScoredPlayerList from '../components/dashboard/rankings/FantasyPointsPlayerList';
import { useAtomValue } from 'jotai';
import { dashboardAtoms } from '../state/dashboard/dashboard.atoms';
import { useMemo } from 'react';
import { useDashboardTeamCheck } from '../hooks/dashboard/useDashboardTeamCheck';

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

  // Get current gameweek for Fantasy Top Performers
  const { currentGameweek } = useDashboardTeamCheck(displaySeason);

  return (
    <PageView className="flex flex-col space-y-4">
      <ClaimAccountNoticeCard />

      {/* Dashboard Hero - Shows team stats or first-time user view */}
      <DashboardHero season={displaySeason} />

      {/* <FeaturedFantasyLeagueGroups /> */}
      <div className="pl-1 pr-1" style={{ marginTop: 8, marginBottom: -8 }}>
        {/* Dominate the SCRUM */}
        <RoundedCard className="flex flex-col sm:flex-row gap-4 pt-5 pb-5 pl-2 pr-2 items-start sm:items-end">
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="font-bold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Dominate the Scrum!</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Create your own league, or join one. Challenge your friends, invite your crew!
              </p>

              <button
                onClick={handleBannerClick}
                className="px-2 py-2.5 rounded-md bg-transparent border border-[#011E5C] dark:border-white font-semibold text-xs text-[#011E5C] dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
              >
                Start Your League
              </button>
            </div>
          </div>

        </RoundedCard>
      </div>

      {/* School Rugby Banner */}
      <SchoolRugbyBanner />

      {/* Fantasy Top Performers */}
      <div className="pl-1 pr-1" style={{ marginTop: 8 }}>
        <FantasyPointsScoredPlayerList season={displaySeason} currentRound={currentGameweek} />
      </div>

      <div className="pl-1 pr-1" style={{ marginTop: 8 }}>

        {/* Make your match predictions */}
        <RoundedCard className="flex flex-col sm:flex-row gap-4 pt-5 pb-5 pl-2 pr-2 items-start sm:items-end">
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="font-bold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Make your match predictions</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600 dark:text-gray-300">
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
          </div>
        </RoundedCard>
      </div>

      {/* Weekly Leaderboards with tabs */}
      {/* <WeeklyLeaderboards season={displaySeason} /> */}
    </PageView>
  );
}
