import useSWR from "swr";
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";
import { useMemo } from "react";

/** Hook for returning rankings based of a sports action */
export function useSportActionRankings(seasonId: string, actionName: string, limit: number = 5) {
    const key = seasonId && actionName ? `/fantasy-seasons/${seasonId}/sports-action-rankings/${actionName}?limit=${limit}` : null;
    const { data, isLoading, mutate } = useSWR(key, () => fantasySeasonsService.getSportActionRankings(
        seasonId,
        actionName,
        limit
    ));

    const rankings = useMemo(() => {
        return (data ?? []);
    }, [data]);

    return {
        rankings,
        isLoading,
        refresh: mutate
    }
}

/** Hook for most selected player rankings based of a sports action */
export function useMostSelectedPlayers(seasonId: string, limit: number = 5) {
    const key = `/fantasy-seasons/${seasonId}/most-selected-players?limit=${limit}`;
    const { data, isLoading, mutate } = useSWR(key, () => fantasySeasonsService.getMostSelectedPlayers(
        seasonId,
        limit
    ));

    const rankings = useMemo(() => {
        return (data ?? []);
    }, [data]);

    return {
        rankings,
        isLoading,
        refresh: mutate
    }
}

/** Hook for most selected player rankings based of a sports action */
export function useFantasyPointsRankings(seasonId: string, limit: number = 5) {
    const key = `/fantasy-seasons/${seasonId}/fantasy-points-scored-rankings?limit=${limit}`;
    const { data, isLoading, mutate } = useSWR(key, () => fantasySeasonsService.getFantasyPointsScoredRankings(
        seasonId,
        limit
    ));

    const rankings = useMemo(() => {
        return (data ?? []);
    }, [data]);

    return {
        rankings,
        isLoading,
        refresh: mutate
    }
}