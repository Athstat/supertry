import useSWR from "swr";
import { fantasyAthleteService } from "../../services/fantasy/fantasyAthleteService";
import { IProAthlete } from "../../types/athletes";
import { useMemo } from "react";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";

/** Hook that fetches a players athlete points breakdown */
export function useAthletePointsBreakdown(athlete: IProAthlete | IFantasyTeamAthlete, roundNumber: number, seasonId: string) {
    const key = `/fantasy-team/${athlete.team_id}/athlete-points-breakdown/${athlete.tracking_id}`
    const { data: pointItems, isLoading } = useSWR(key, () => fantasyAthleteService.getRoundPointsBreakdown(
        athlete.tracking_id,
        roundNumber,
        seasonId
    ), {
        refreshInterval: 1000 * 60 * 1 // Every minute
    });

    const totalPoints = useMemo(() => {
        return pointItems?.reduce((sum, curr) => {
            return sum + (curr.score ?? 0);
        }, 0)
    }, [pointItems]) ?? 0;

    return {
        pointItems,
        isLoading,
        totalPoints
    }
}