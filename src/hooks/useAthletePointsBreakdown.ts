import { useAtomValue } from "jotai";
import { useFetch } from "./useFetch";
import { fantasyLeagueAtom } from "../state/fantasy/fantasyLeague.atoms";

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
        , async ({  }) => {
            return []
        });
}