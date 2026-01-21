import { useMemo } from "react";
import useSWR from "swr";
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";

/** Hook that fetches the featured league from the selected fantasy season,
 * provided by the fantasy seasons provider
 */
export function useFeaturedLeague() {
    const { selectedSeason: season, isLoading: loadingSeasons } = useFantasySeasons();

    const key = season ? `fantasy-season/${season.id}/` : null;
    const { data: featuredLeagues, isLoading: loadingLeague } = useSWR(key, () => fantasySeasonsService.getFeaturedLeagueGroups(season?.id || ''), {
        revalidateOnFocus: false
    });

    const featuredLeague = useMemo(() => {
        if (featuredLeagues && featuredLeagues.length > 0) {
            return featuredLeagues[0];
        }

        return undefined;
    }, [featuredLeagues]);

    const isLoading = loadingLeague || loadingSeasons;

    return {
        featuredLeague,
        isLoading
    }
}