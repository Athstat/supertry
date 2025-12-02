import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";

/** A hook that fetches a season */
export function useSeason(seasonId?: string) {
    const key = seasonId ? `/seasons/${seasonId}` : null;
    const {data, isLoading, error} = useSWR(key, () => seasonService.getSeasonsById(seasonId ?? ""));

    return {
        season: data,
        isLoading,
        error
    }
}