import { useMemo } from "react";
import useSWR from "swr";
import { fantasySeasonsService } from "../../../../services/fantasy/fantasySeasonsService";

/** Hook that fetches the official league group for a fantasy season */
export function useOfficialLeagueGroup(seasonId?: string) {
    const key = seasonId ? `fantasy-season/${seasonId}/` : null;
    const { data: featuredLeagues, isLoading } = useSWR(key, () => fantasySeasonsService.getFeaturedLeagueGroups(seasonId || ''));

    const featuredLeague = useMemo(() => {
        if (featuredLeagues && featuredLeagues.length > 0) {
            return featuredLeagues[0];
        }

        return undefined;
    }, [featuredLeagues]);

    return {
        featuredLeague,
        isLoading
    }
}