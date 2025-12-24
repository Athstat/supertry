import { useCallback, useEffect, useMemo } from "react";
import { getLeagueStandingsFilterItems } from "../../utils/standingsUtils";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useQueryState } from "../useQueryState";
import { fantasyAnalytics } from "../../services/analytics/fantasyAnalytics";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";

/** Hook that provides data and logic for league standings filtering */
export function useLeagueRoundStandingsFilter() {

    const { sortedRounds, scoringRound } = useFantasyLeagueGroup();

    const defaultFilterVal = useMemo(() => {
        return scoringRound?.id || "overall"
    }, [scoringRound?.id]);

    const [roundFilterId, setRoundFilterId] = useQueryState<string | undefined>('round_filter', { init: defaultFilterVal });

    const options = useMemo(() => {
        return getLeagueStandingsFilterItems(sortedRounds);
    }, [sortedRounds]);

    const currentOption = useMemo(() => {
        return options.find((p) => p.id?.toString() === roundFilterId);
    }, [options, roundFilterId])

    const otherOptions = useMemo(() => {
        return options.filter((p) => {
            return p.id?.toString() !== roundFilterId;
        });
    }, [options, roundFilterId]);

    const handleSetRoundFilterId = useCallback((newValue?: string) => {
        setRoundFilterId(newValue);
        fantasyAnalytics.trackStandings_Week_Filter_Applied();
    }, [setRoundFilterId]);

    const selectedRound = useMemo<IFantasyLeagueRound | undefined>(() => {

        return sortedRounds.find((r) => {
            return r.id.toString() === roundFilterId;
        })

    }, [roundFilterId, sortedRounds]);

    useEffect(() => {
        if (roundFilterId === undefined && scoringRound) {
            setRoundFilterId(scoringRound.id);
        }
    }, [roundFilterId, scoringRound, setRoundFilterId]);

    console.log("Round Filter ID ", roundFilterId);


    return {
        currentOption,
        otherOptions,
        rounds: sortedRounds,
        roundFilterId,
        setRoundFilterId: handleSetRoundFilterId,
        selectedRound
    }
}