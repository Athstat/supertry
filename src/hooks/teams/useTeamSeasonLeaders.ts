import useSWR from "swr";
import { teamService } from "../../services/teams/teamService";

/** Hook that fetches the season leaders for a team */
export function useTeamSeasonLeaders(teamId: string | undefined, seasonId: string | undefined) {
    
    const cancleFetch = !teamId || !seasonId;
    const key = cancleFetch ? null : `/teams/${teamId}/seasons/${seasonId}/stats/leaders`;
    const {data, isLoading} = useSWR(key, () => teamService.getTeamSeasonLeaders(teamId ?? "", seasonId ?? ""), {
        revalidateOnFocus: false
    });

    return {
        leaders: data,
        isLoading
    }
}