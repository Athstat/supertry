import { useMemo } from "react";
import useSWR from "swr";
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";

type FantasyPointsRankingsOptions = {
    round_number?: number | string
}

/** Hook for most selected player rankings based of a sports action */
export function useFantasyPointsRankings(seasonId?: string, limit: number = 5, options?: FantasyPointsRankingsOptions) {
    
    const round_num = options?.round_number;
    const query_params = `?limit=${limit}${round_num ? `&round_number=${round_num}` : ''}`;

    // When key is null SWR will not make fetch call
    const key = seasonId ? `/fantasy-seasons/${seasonId}/fantasy-points-scored-rankings${query_params}` + round_num : null;
    
    const { data, isLoading, mutate } = useSWR(key, () => fantasySeasonsService.getFantasyPointsScoredRankings(
        seasonId || "",
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