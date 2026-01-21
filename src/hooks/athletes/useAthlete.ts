import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys";
import { athleteService } from "../../services/athletes/athletesService";

/** Hook that provides logic for fetching a player profile */
export function useAthlete(athleteId?: string) {
    const key = athleteId ? swrFetchKeys.getAthleteById(athleteId) : null;;
    const {data, isLoading} = useSWR(key, () => athleteService.getAthleteById(athleteId ?? ""));

    return {
        athlete: data,
        isLoading,
    }
}