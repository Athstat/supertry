import useSWR from "swr";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { fantasySeasonTeamService } from "../../services/fantasy/fantasySeasonTeamService";

/** Component that fetches a user's fantasy league round team with athletes */
export function useUserRoundTeam(userId?: string, roundNumber?: number | string, shouldFetch: boolean = true) {
    
    const {selectedSeason} = useFantasySeasons();
    const seasonId = selectedSeason?.id;

    const finalShouldFetch = shouldFetch && Boolean(userId) && Boolean(roundNumber) && Boolean(seasonId);
    const fetchKey = finalShouldFetch ? `/fantasy-seasons/${seasonId}/users/${userId}/teams/${roundNumber}` : null;
    
    const { data: roundTeam, isLoading, error, mutate } = useSWR(fetchKey, () => fantasySeasonTeamService.getRoundTeam(seasonId ?? '',userId ?? "", roundNumber || ''), {
        revalidateOnFocus: false,
        revalidateIfStale: true
    });

    const hasTeam = roundTeam !== undefined && roundTeam !== null;

    return {
        roundTeam,
        isLoading,
        hasTeam,
        error,
        mutate
    }

}