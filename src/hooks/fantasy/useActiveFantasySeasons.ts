import useSWR from "swr";
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";
import { swrFetchKeys } from "../../utils/swrKeys";
import { useAuth } from "../../contexts/AuthContext";

/** A Hook that fetches fantasy seasons */
export function useActiveFantasySeasons() {
    const {authUser} = useAuth();
    const seasonsKey = authUser ? swrFetchKeys.getActiveFantasySeasons(authUser?.kc_id) : null;
    const { data, isLoading, error, mutate } = useSWR(seasonsKey, () => fantasySeasonsService.getAllFantasySeasons(true), {
        revalidateOnFocus: false
    });

    return {
        seasons: data,
        isLoading,
        error, 
        mutate
    }
}