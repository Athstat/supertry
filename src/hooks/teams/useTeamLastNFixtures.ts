import useSWR from "swr";
import { teamService } from "../../services/teams/teamService";
import { useMemo } from "react";

/** Hook for fetching last n fixtures for a team */
export function useTeamLastNFixtures(teamId?: string, limit: number = 5) {
    const key = teamId ? `/teams/${teamId}/past-fixtures?limit=${limit}` : null;
    
    const {data, isLoading} = useSWR(key, () => teamService.getLastNFixtures(teamId ?? ""), {
        revalidateOnFocus: false
    });

    const fixtures = useMemo(() => (data ?? []), [data]);
    return {
        isLoading,
        fixtures
    }
}