import { FantasyLeagueContext } from "../contexts/FantasyLeagueContext";
import { athleteService } from "../services/athleteService";
import { useFetch } from "./useFetch";
import { useContext } from "react";

export function useAthletePointsBreakdown(trackingId: string) {

    const league = useContext(FantasyLeagueContext);

    return useFetch(
        "points-breakdown",
        {
            leagueId: league?.league?.official_league_id,
            round: league?.league?.start_round ?? -1,
            trackingId
        }
        , async ({ leagueId, round, trackingId }) => {
            return await athleteService.getAthletePointsBreakdownByLeagueAndRound(
                trackingId, round, leagueId ?? "fall-back"
            )
        });
}