import { useCallback, useEffect, useMemo, useState } from "react";
import { fantasyAnalytics } from "../../services/analytics/fantasyAnalytics";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { StandingsFilterItem } from "../../types/standings";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";

/** Hook that provides data and logic for league standings filtering */
export function useLeagueRoundStandingsFilter() {

    const { scoringRound, seasonRounds } = useFantasySeasons();

    const [roundFilterId, setRoundFilterId] = useState<string | undefined>(scoringRound?.round_number.toString() || "overall");

    const options: StandingsFilterItem[] = useMemo(() => {
        return seasonRounds.map((s) => {
            return {
                lable: s.round_title,
                id: s.round_number.toString()
            }
        });
    }, [seasonRounds]);

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

    const selectedRound = useMemo<ISeasonRound | undefined>(() => {

        return seasonRounds.find((r) => {
            return r.round_number.toString() === roundFilterId;
        })

    }, [roundFilterId, seasonRounds]);

    useEffect(() => {
        if (roundFilterId === undefined && scoringRound) {
            setRoundFilterId(scoringRound.id);
        }
    }, [roundFilterId, scoringRound, setRoundFilterId]);


    return {
        currentOption,
        otherOptions,
        roundFilterId,
        setRoundFilterId: handleSetRoundFilterId,
        selectedRound
    }
}