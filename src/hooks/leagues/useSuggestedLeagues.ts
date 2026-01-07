import { useMemo } from 'react';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import useSWR from "swr";

/** Fetches leagues that the user can join */
export function useSuggestedLeagues(seasonId?: string) {
    const key = seasonId ? `/fantasy-seasons/${seasonId}/fantasy-league-groups/joinable-leagues` : null;
    const {data, isLoading, error} = useSWR(key, () => fantasyLeagueGroupsService.getDiscoverLeagues(seasonId));

    const joinableLeagues = useMemo(() => {
        return data ?? [];
    }, [data]);

    return {
        joinableLeagues,
        isLoading,
        error
    }
}