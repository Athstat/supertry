import useSWR from "swr";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { seasonService } from "../../services/seasonsService";

/** Hook for fetching games in a specific round */
export function useRoundGames(round?: ISeasonRound) {
    
    const fetchKey = round ? `/rounds/${round.id}/games` : null;
    const {data:fetchedGames, isLoading} = useSWR(fetchKey, () => seasonService.getSeasonFixtures(
        round?.season ?? '',
        round?.round_number ?? 0
    ));

    const games = (fetchedGames ?? []);

    return {
        games,
        isLoading,
        round
    }
}