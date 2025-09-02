import { useMemo } from "react";
import { getLeagueStandingsFilterItems } from "../../utils/standingsUtils";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useQueryState } from "../useQueryState";

/** Hook that provides data and logic for league standings filtering */
export function useLeagueRoundStandingsFilter() {

    const [roundFilterId, setRoundFilterId] = useQueryState<string | undefined>('round_filter', { init: 'overall' });

    const { rounds } = useFantasyLeagueGroup();

    const options = useMemo(() => {
        return getLeagueStandingsFilterItems(rounds);
    }, [rounds]);

    const currentOption = useMemo(() => {
        return options.find((p) => p.id === roundFilterId);
    }, [options, roundFilterId])

    const otherOptions = useMemo(() => {
        return options.filter((p) => {
            return p.id !== roundFilterId;
        });
    }, [options, roundFilterId]);


    return {
        currentOption,
        otherOptions,
        rounds,
        roundFilterId,
        setRoundFilterId
    }
}