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
    const seasonId = selectedSeason?.id;

    const key = teamId ? `/pro-teams/${teamId}/athletes${seasonId ? `?season_id=${seasonId}` : ''}` : null;
    const {data, isLoading, error} = useSWR(key, () => teamService.getAthletesBySeason(teamId || '', seasonId));

    const athletes = useMemo(() => {
        return data || [];
    }, [data]);

    return {
        athletes,
        isLoading,
        error
    }
}