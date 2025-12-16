import useSWR from "swr";
import { teamService } from "../../services/teams/teamService";

/** Hook for fetching a pro team */
export function useProTeam(teamId?: string) {
    const key = teamId ? `/pro-teams/${teamId}` : null;
    const {data, isLoading} = useSWR(key, () => teamService.getTeamById(teamId || ""));

    return {
        team: data, isLoading
    }
}