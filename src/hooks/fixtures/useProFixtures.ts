import useSWR from "swr";
import { gamesService } from "../../services/gamesService";
import { useMemo } from "react";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";

/** Hook that fetches pro fixtures */
export function useProFixtures() {

    const {selectedSeason} = useFantasySeasons();

    const leagueId = selectedSeason?.id;

    const key = `/pro/fixtures${leagueId ? `/leagues/${leagueId}` : ''}`;
    const { data, isLoading, error, mutate } = useSWR(key, () => gamesService.getAllSupportedGames(leagueId));

    const fixtures = useMemo(() => {
        return data || [];
    }, [data]);

    return {
        fixtures,
        isLoading,
        error,
        mutate
    }

}