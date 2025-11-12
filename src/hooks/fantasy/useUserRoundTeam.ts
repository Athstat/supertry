import useSWR from "swr";
import { leagueService } from "../../services/leagueService";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";

/** Component that fetches a user's fantasy league round team with athletes */
export function useUserRoundTeam(leagueRound?: IFantasyLeagueRound, userId?: string, shouldFetch: boolean = true) {
    
    const finalShouldFetch = shouldFetch && Boolean(userId) && Boolean(leagueRound);
    const fetchKey = finalShouldFetch ? `/fantasy-league-rounds/${leagueRound?.id}/user-teams/${userId}` : null;
    const { data: roundTeam, isLoading, error } = useSWR(fetchKey, () => leagueService.getUserRoundTeam(leagueRound?.id ?? 0, userId ?? ""));

    return {
        roundTeam,
        isLoading,
        error
    }

}