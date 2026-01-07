import useSWR from "swr";
import { pickemService } from "../../services/pickemService";
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";

/** Hook that fectches pickem overall rankings for a specific season */
export function usePickemOverallRanking(seasonId?: string) {
    const key = seasonId ? `/pro/pickem/seasons/${seasonId}/rankings` : null;
    const {data, isLoading, error} = useSWR(key, () => pickemService.getSeasonOverallRankings(seasonId || ''));

    const rankings = useMemo(() => {
        return data || [];
    }, [data]);

    return {
        rankings,
        isLoading,
        error
    }

}

/** Hook that fetches a user's pickem overall ranking */
export function useUserPickemOverallRanking(seasonId?: string, userId?: string) {

    const {authUser} = useAuth();
    const finalUserId = userId || authUser?.kc_id;

    const shouldFetch = Boolean(seasonId) && Boolean(finalUserId);

    const key = shouldFetch ? `/pro/pickem/seasons/${seasonId}/rankings/${finalUserId}` : null;
    const {data, isLoading, error} = useSWR(key, () => pickemService.getUserSeasonOverallRankings(seasonId || '', finalUserId || ""));

    const userRank = useMemo(() => {
        return data;
    }, [data]);

    return {
        userRank,
        isLoading,
        error
    }

}