import useSWR from "swr";
import { fantasyAthleteService } from "../../services/fantasy/fantasyAthleteService";
import { useMemo } from "react";

/** Hook that returns a players score for a specific season round  */
export function useAthleteRoundScore(athleteId: string, seasonId: string, round: number | string, shouldFetch: boolean = true) {
    const shouldFetchFinal = Boolean(athleteId) && Boolean(seasonId) && Boolean(round) && shouldFetch;

    const key = shouldFetchFinal ? `/fantasy-athletes/${athleteId}/season/${seasonId}/round/${round}` : null;
    const {data, isLoading, error} = useSWR(key, () => fantasyAthleteService.getRoundScore(athleteId, seasonId, round), {
        refreshInterval: 1000 * 10 // 30 seconds
    });

    const score = useMemo(() => data?.score || 0, [data]);

    return {
        isLoading,
        error,
        score,
        seasonId,
        round,
        athleteId
    }
}