import useSWR from 'swr';
import { useAuth } from '../../../contexts/AuthContext';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { leagueService } from '../../../services/leagueService';
import RoundedCard from '../../shared/RoundedCard';
import UserRoundOverviewCard, { NoTeamRoundOverviewCard } from './UserRoundOverviewCard';
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from '../../../types/fantasyLeague';
import UserRoundScoringUpdate from './UserRoundScoringUpdate';
import UserTeamOverview from './UserTeamOverview';
import { GamePlayHelpButton } from '../../branding/help/LearnScrummyNoticeCard';
import LeagueRoundCountdown from '../LeagueCountdown';
import BlueGradientCard from '../../shared/BlueGradientCard';
import { useEffect } from 'react';
import { fantasyAnalytics } from '../../../services/analytics/fantasyAnalytics';

export default function LeagueOverviewTab() {
  const { currentRound, league } = useFantasyLeagueGroup();
  const { authUser } = useAuth();

  const key = swrFetchKeys.getUserFantasyLeagueRoundTeam(
    currentRound?.fantasy_league_group_id ?? '',
    currentRound?.id ?? '',
    authUser?.kc_id
  );

  const { data: userTeam, isLoading } = useSWR(key, () =>
    leagueService.getUserRoundTeam(currentRound?.id ?? '', authUser?.kc_id ?? '')
  );
  console.log('userTeam: ', userTeam);

  useEffect(() => {
    fantasyAnalytics.trackVisitedLeagueOverviewScreen(league?.id);
  }, []);

  if (isLoading) {
    return (
      <div>
        <RoundedCard className="p-4 h-[150px] border-none animate-pulse"></RoundedCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">Overview</h2>
        </div>

        <div>
          <GamePlayHelpButton />
        </div>
      </div>

      {currentRound && (
        <LeagueRoundSummary showCountdownOnly userTeam={userTeam} currentRound={currentRound} />
      )}

      {userTeam && currentRound && (
        <UserRoundScoringUpdate leagueRound={currentRound} userTeam={userTeam} />
      )}

      {currentRound && userTeam && (
        <UserTeamOverview userTeam={userTeam} leagueRound={currentRound} />
      )}
    </div>
  );
}

type RoundSummaryProps = {
  userTeam?: FantasyLeagueTeamWithAthletes;
  currentRound: IFantasyLeagueRound;
  onPickTeam?: () => void;
  onViewTeam?: () => void;
  onViewStandings?: () => void;
  showCountdownOnly?: boolean;
};

export function LeagueRoundSummary({
  userTeam,
  currentRound,
  onPickTeam,
  onViewStandings,
  onViewTeam,
  showCountdownOnly,
}: RoundSummaryProps) {
  if (userTeam) {
    if (showCountdownOnly) {
      return (
        <BlueGradientCard className="flex flex-col gap-1">
          <p>⏰ {currentRound.title} - Deadline</p>
          <LeagueRoundCountdown leagueRound={currentRound} />
        </BlueGradientCard>
      );
    }

    return (
      <UserRoundOverviewCard
        leagueRound={currentRound}
        userTeam={userTeam}
        onViewStandings={onViewStandings}
        onViewTeam={onViewTeam}
      />
    );
  }

  return (
    <NoTeamRoundOverviewCard
      leagueRound={currentRound}
      onHandleViewStandings={onViewStandings}
      onPickTeam={onPickTeam}
    />
  );
}
