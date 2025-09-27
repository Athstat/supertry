import { useCallback, useMemo } from "react";
import { getLeagueStandingsFilterItems } from "../../utils/standingsUtils";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useQueryState } from "../useQueryState";
import { fantasyAnalytics } from "../../services/analytics/fantasyAnalytics";

/** Hook that provides data and logic for league standings filtering */
export function useLeagueRoundStandingsFilter() {

    const { sortedRounds, currentRound } = useFantasyLeagueGroup();
    const defaultFilterVal = currentRound?.id;
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


    return {
        currentOption,
        otherOptions,
        rounds: sortedRounds,
        roundFilterId,
        setRoundFilterId: handleSetRoundFilterId
    }
}