import useSWR from "swr";
import { teamService } from "../../services/teams/teamService";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { useMemo } from "react";

/** Hook for fetching a pro team */
export function useProTeam(teamId?: string) {
    const key = teamId ? `/pro-teams/${teamId}` : null;
    const {data, isLoading} = useSWR(key, () => teamService.getTeamById(teamId || ""));

    return {
        team: data, isLoading
    }
}

/** Hook for fetching the athletes belonging to a pro team */
export function useProTeamAthletes(teamId?: string) {

    const {selectedSeason} = useFantasySeasons();

    const key = teamId ? `/pro-teams/${teamId}/athletes` : null;
    const {data, isLoading, error} = useSWR(key, () => teamService.getAthletes(teamId || '', selectedSeason?.id));

    const athletes = useMemo(() => {
        return data || [];
    }, [data]);

    return {
        athletes,
        isLoading,
        error
    }
}