import useSWR from "swr";
import { leagueService } from "../../services/leagueService";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { fantasySeasonTeamService } from "../../services/fantasy/fantasySeasonTeamService";

/** Component that fetches a user's fantasy league round team with athletes */
export function useUserRoundTeam(leagueRoundId?: string | number, userId?: string, shouldFetch: boolean = true) {
    
    const finalShouldFetch = shouldFetch && Boolean(userId) && Boolean(leagueRoundId);
    const fetchKey = finalShouldFetch ? `/fantasy-league-rounds/${leagueRoundId}/user-teams/${userId}` : null;
    
    const { data: roundTeam, isLoading, error } = useSWR(fetchKey, () => leagueService.getUserParticipatingTeam(leagueRoundId ?? "", userId ?? ""));
    const hasTeam = roundTeam !== undefined && roundTeam !== null;

    return {
        roundTeam,
        isLoading,
        hasTeam,
        error
    }

}

/** Component that fetches a user's fantasy league round team with athletes */
export function useUserRoundTeamV2(userId?: string, roundNumber?: number | string, shouldFetch: boolean = true) {
    
    const {selectedSeason} = useFantasySeasons();
    const seasonId = selectedSeason?.id;

    const finalShouldFetch = shouldFetch && Boolean(userId) && Boolean(roundNumber) && Boolean(seasonId);
    const fetchKey = finalShouldFetch ? `/fantasy-seasons/${seasonId}/users/${userId}/teams/${roundNumber}` : null;
    
    const { data: roundTeam, isLoading, error } = useSWR(fetchKey, () => fantasySeasonTeamService.getRoundTeam(seasonId ?? '',userId ?? "", roundNumber || ''), {
        revalidateOnFocus: false
    });
    const hasTeam = roundTeam !== undefined && roundTeam !== null;

    return {
        roundTeam,
        isLoading,
        hasTeam,
        error
    }

}