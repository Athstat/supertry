import useSWR from "swr";
import { useMemo } from "react";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { competitionService } from "../../services/competitionsService";
import { seasonService } from "../../services/seasonsService";

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


/** Fetches games for a specific season round */
export function useSeasonRoundFixtures( seasonId?: string, roundNumber?: number | string ) {

    const {selectedSeason, currentRound} = useFantasySeasons();

    const finalSeasonId = seasonId || selectedSeason?.id;
    const finalRound = roundNumber || currentRound?.round_number;
    const shouldFetch = finalSeasonId && finalRound;

    const key = shouldFetch ? `/seasons/${finalSeasonId}/rounds/${finalRound}/fixtures` : null;
    const { data, isLoading, error, mutate } = useSWR(key, () => seasonService.getSeasonFixtures(finalSeasonId || '', roundNumber));

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