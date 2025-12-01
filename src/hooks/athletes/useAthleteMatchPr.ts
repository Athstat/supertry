import useSWR from "swr";
import { gamesService } from "../../services/gamesService";

/** Hook that fetches an athletes power ranking for a single match */
export function useAthleteMatchPr(athleteId: string | undefined, fixtureId: string | undefined) {
    
    const cancelFetch = !athleteId || !fixtureId;

    const key = cancelFetch ? null : `/fixtures/${fixtureId}/power-rankings/athletes/${athleteId}`;
    const {data: pr, isLoading} = useSWR(key, () => gamesService.getAthleteMatchPr(fixtureId ?? "", athleteId ?? ""));

    return {pr, isLoading};
} 