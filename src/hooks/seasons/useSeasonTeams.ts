import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";

export function useSeasonTeams(seasonId?: string) {
    const seasonTeamsKey = seasonId ? `seasons-teams/${seasonId}` : null;
    const { data: teams, isLoading, mutate, error} = useSWR(seasonTeamsKey, () => seasonService.getSeasonTeams(seasonId ?? ""));

    return {
        teams,
        isLoading,
        mutate,
        error
    }
}