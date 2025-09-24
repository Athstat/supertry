import { useAtomValue } from "jotai";
import { useMemo, useCallback } from "react";
import { fantasySeasonsAtom, SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY } from "../../state/fantasy/fantasyLeagueScreen.atoms";
import { IFantasySeason } from "../../types/fantasy/fantasySeason";
import { useQueryState } from "../useQueryState";

/** Provides functionality and access to the fantasy league screens data */
export function useFantasyLeaguesScreen() {
    const fantasySeasons = useAtomValue(fantasySeasonsAtom);

    const [selectedFantasySeasonId, setSelectedFantasySeasonId] = useQueryState<string>(
        SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY
    );

    const selectedSeason = useMemo(() => {
        const foundSeason = fantasySeasons.find((s) => {
            return s.id === selectedFantasySeasonId;
        });

        return foundSeason;
    }, [selectedFantasySeasonId, fantasySeasons]);

    const setSelectedSeason = useCallback((season: IFantasySeason) => {
        setSelectedFantasySeasonId(season.id);
    }, [setSelectedFantasySeasonId]);


    return {
        selectedSeason,
        selectedFantasySeasonId,
        setSelectedSeason
    }
}