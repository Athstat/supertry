import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";
import { useMemo } from "react";

export function useSeasonTeams(seasonId?: string) {
    const seasonTeamsKey = seasonId ? `seasons-teams/${seasonId}` : null;
    const { data, isLoading, mutate, error} = useSWR(seasonTeamsKey, () => seasonService.getSeasonTeams(seasonId ?? ""));

    const sortedTeams = useMemo(() => {
        return [...(data || [])].sort((a, b) => {
            return a.athstat_name.localeCompare(b.athstat_name)
        })
    },[data]);

    return {
        teams: sortedTeams,
        isLoading,
        mutate,
        error
    }
}