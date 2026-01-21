import useSWR from "swr";
import { athleteService } from "../../services/athletes/athletesService";
import { useMemo } from "react";

/** hook that fetches a player's next matches */
export function usePlayerNextMatch(athleteId?: string, limit: number = 1) {
    const key = athleteId ? `/api/v1/athletes/${athleteId}/next-matches?limit=${limit}` : null;
    const {data, isLoading, error, mutate} = useSWR(key, () => athleteService.getNextNMatches(athleteId || ""));

    const nextMatches = useMemo(() => {
        return data || [];
    }, [data]);

    const nextMatch = useMemo(() => {
        if (nextMatches.length > 0) {
            return nextMatches[0];
        }

        return undefined;
    }, [nextMatches]);

    return {
        isLoading,
        nextMatch,
        nextMatches,
        error,
        mutate
    }
}