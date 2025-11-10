import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { Target } from 'lucide-react';
import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { useLeagueRoundStandingsFilter } from '../../hooks/fantasy/useLeagueRoundStandingsFilter';
import LeagueStandingsFilterSelector, {
  SelectedWeekIndicator,
} from './standings/LeagueStandingsFilterSelector';
import LeaguePredictionsLeaderboard from './predictions/LeaguePredictionsLeaderboard';
import { leaguePredictionsService } from '../../services/fantasy/leaguePredictionsService';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';

export function LeaguePredictionsTab() {
  const { league } = useFantasyLeagueGroup();
  const { roundFilterId } = useLeagueRoundStandingsFilter();

  const groupId = league?.id;
  const fetchKey = useMemo(() => {
    return league && `/fantasy-league-groups/${league.id}/predictions/${roundFilterId}`;
  }, [league?.id, roundFilterId]);

  // Fetch league prediction rankings
  const {
    data: rankings,
    isLoading,
    error,
  } = useSWR(
    fetchKey,
    () =>
      leaguePredictionsService.getLeaguePredictionsRankings(
        groupId as string,
        roundFilterId ?? 'overall'
      ),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    fantasyAnalytics.trackViewedPredictionsTab();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Target />
          <p className="font-bold text-xl">Predictions</p>
        </div>

        <div>
          <LeagueStandingsFilterSelector />
        </div>
      </div>

      <SelectedWeekIndicator />

      <LeaguePredictionsLeaderboard
        rankings={rankings || []}
        isLoading={isLoading}
        leagueId={groupId as string}
        roundId={roundFilterId}
      />
    </div>
  );
}
