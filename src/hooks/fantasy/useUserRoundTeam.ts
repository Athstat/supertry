import useSWR from "swr";
import { leagueService } from "../../services/leagueService";

/** Component that fetches a user's fantasy league round team with athletes */
export function useUserRoundTeam(leagueRoundId?: string | number, userId?: string, shouldFetch: boolean = true) {
    
    const finalShouldFetch = shouldFetch && Boolean(userId) && Boolean(leagueRoundId);
    const fetchKey = finalShouldFetch ? `/fantasy-league-rounds/${leagueRoundId}/user-teams/${userId}` : null;
    
    const { data: roundTeam, isLoading, error } = useSWR(fetchKey, () => leagueService.getUserParticipatingTeam(leagueRoundId ?? "", userId ?? ""));

    return {
        roundTeam,
        isLoading,
        error
    }

}