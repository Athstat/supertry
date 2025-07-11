import { useAtomValue } from "jotai";
import { athleteService } from "../services/athleteService";
import { useFetch } from "./useFetch";
import { fantasyLeagueAtom } from "../state/fantasyLeague.atoms";

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
        , async ({ leagueId, round, trackingId }) => {
            return await athleteService.getAthletePointsBreakdownByLeagueAndRound(
                trackingId, round, leagueId ?? "fall-back"
            )
        });
}