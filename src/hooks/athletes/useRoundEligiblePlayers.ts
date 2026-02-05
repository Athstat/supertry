import useSWR from "swr";
import { useFantasySeasons } from "../dashboard/useFantasySeasons"
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";

/** Fetches a list of players who are eligible to be picked and selected on to a team for a fantasy season round */
export function useRoundEligiblePlayers(roundNumber?: string | number) {

    const {selectedSeason, currentRound} = useFantasySeasons();
    const seasonId = selectedSeason?.id;
    const finalRoundNumber = roundNumber || currentRound?.round_number;

    const shouldFetch = Boolean(seasonId) && (finalRoundNumber !== undefined);
    const key = shouldFetch ?  `/fantasy-seasons/${seasonId}/rounds/${finalRoundNumber}/eligibles` : null;

    const {data, isLoading} = useSWR(key, () => fantasySeasonsService.getRoundEligibles(seasonId || '', roundNumber || 0));

    const athletes = (data || []);

    return {
        athletes,
        isLoading
    }
}