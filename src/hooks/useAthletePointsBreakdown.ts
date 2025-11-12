import { useAtomValue } from "jotai";
import { useFetch } from "./useFetch";
import { fantasyLeagueAtom } from "../state/fantasy/fantasyLeague.atoms";
import useSWR from "swr";
import { fantasyAthleteService } from "../services/fantasy/fantasyAthleteService";
import { useMemo } from "react";

export function useAthletePointsBreakdown(trackingId: string) {

    const league = useAtomValue(fantasyLeagueAtom);

    console.log('Here are the keys to the city',
        {
            leagueId: league?.official_league_id,
            round: league?.start_round ?? -1,
            trackingId
        }
    )

    return useFetch(
        "points-breakdown",
        {
            leagueId: league?.official_league_id,
            round: league?.start_round ?? 1,
            trackingId
        }
        , async () => {
            return []
        });
}

/** Hook that returns a players score for a specific season round  */
export function useAthleteRoundScore(athleteId: string, seasonId: string, round: number | string) {
    const key = `/fantasy-athletes/${athleteId}/season/${seasonId}/round/${round}`;
    const {data, isLoading, error} = useSWR(key, () => fantasyAthleteService.getRoundScore(athleteId, seasonId, round));

    const score = useMemo(() => data?.score || 0, [data]);

    return {
        isLoading,
        error,
        score,
        seasonId,
        round,
        athleteId
    }
}