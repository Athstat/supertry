import useSWR from "swr";
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";
import { swrFetchKeys } from "../../utils/swrKeys";

/** A Hook that fetches fantasy seasons */
export function useActiveFantasySeasons() {
    const seasonsKey = swrFetchKeys.getActiveFantasySeasons()
    const { data, isLoading, error, mutate } = useSWR(seasonsKey, () => fantasySeasonsService.getAllFantasySeasons(true));

    return {
        seasons: data,
        isLoading,
        error, 
        mutate
    }
}