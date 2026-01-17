import useSWR from "swr";
import { useMemo } from "react";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { competitionService } from "../../services/competitionsService";

/** Hook that fetches pro fixtures */
export function useProFixtures() {

    const {selectedSeason} = useFantasySeasons();

    const competitionId = selectedSeason?.competition_id;
    const key = competitionId ? `/competitions/${competitionId}/games` : null;

    const { data, isLoading, error, mutate } = useSWR(key, () => competitionService.getFixtures(competitionId || ''));

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