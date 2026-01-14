import useSWR from "swr";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { useMemo } from "react";
import { FantasySeasonRankingItem, FantasySeasonWeeklyRanking } from "../../../types/fantasyLeagueGroups";

type LeagueStandingsHookOptions = {
  round_number?: number | string | "overall" | undefined
}

/** Hook that fetches standings for a fantasy league group */
export function useLeagueGroupStandings(leagueGroupId?: string, options?: LeagueStandingsHookOptions) {

  const shouldFetch = Boolean(leagueGroupId);
  const round_number = options?.round_number;

  const key = shouldFetch ? `/fantasy-league-groups/${leagueGroupId}/standings/overall${round_number ? `/weekly/${round_number}` : ""}` : null;
  const { data, isLoading, error } = useSWR(key, () => {
    return leagueStandingsFetcher(leagueGroupId || '', round_number);
  }, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    refreshInterval: 1000 * 60 * 5 // every 5 minutes
  });

  const standings = useMemo(() => {
    return data || []
  }, [data]);


  return {
    standings,
    isLoading,
    error
  }

}


async function leagueStandingsFetcher(
  groupId: string,
  roundNumber: string | 'overall' | undefined | number
): Promise<(FantasySeasonRankingItem | FantasySeasonWeeklyRanking)[]> {

  if (roundNumber === 'overall' || !roundNumber) {
    return await fantasyLeagueGroupsService.getOverallStandings(groupId);
  }

  return fantasyLeagueGroupsService.getWeeklyStandings(groupId, roundNumber);
}