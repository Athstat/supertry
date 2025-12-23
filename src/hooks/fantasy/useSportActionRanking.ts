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
    const key = seasonId ? `/fantasy-seasons/${seasonId}/most-selected-players?limit=${limit}` : null;
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

type FantasyPointsRankingsOptions = {
    round_number?: number | string
}

/** Hook for most selected player rankings based of a sports action */
export function useFantasyPointsRankings(seasonId: string, limit: number = 5, options?: FantasyPointsRankingsOptions) {
    
    const round_num = options?.round_number;
    const query_params = `?limit=${limit}${round_num ? `&round_number=${round_num}` : ''}`;
    const key = `/fantasy-seasons/${seasonId}/fantasy-points-scored-rankings${query_params}`;
    
    const { data, isLoading, mutate } = useSWR(key, () => fantasySeasonsService.getFantasyPointsScoredRankings(
        seasonId,
        limit,
        round_num
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