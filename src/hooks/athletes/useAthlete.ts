import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys";
import { djangoAthleteService } from "../../services/athletes/djangoAthletesService";

/** Hook that provides logic for fetching a player profile */
export function useAthlete(athleteId: string) {
    const key = swrFetchKeys.getAthleteById(athleteId);
    const {data, isLoading} = useSWR(key, () => djangoAthleteService.getAthleteById(athleteId));

    return {
        athlete: data,
        isLoading,
    }
}