import { FantasyLeagueContext } from "../contexts/FantasyLeagueContext";
import { athleteService } from "../services/athleteService";
import { useFetch } from "./useAsync";
import { useContext } from "react";

export function useAthletePointsBreakdown(trackingId: string) {

    const league = useContext(FantasyLeagueContext);

    return useFetch(
        "points-breakdown",
        {
            leagueId: league?.official_league_id,
            round: league?.start_round ?? -1,
            trackingId
        }
        , async ({ leagueId, round, trackingId }) => {
            return await athleteService.getAthletePointsBreakdownByLeagueAndRound(
                trackingId, round, leagueId ?? "fall-back"
            )
        });
}