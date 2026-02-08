import useSWR from "swr";
import { fantasyAthleteService } from "../../services/fantasy/fantasyAthleteService";
import { IProAthlete } from "../../types/athletes";
import { useMemo } from "react";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";

/** Hook that fetches a players athlete points breakdown */
export function useAthletePointsBreakdown(athlete: IProAthlete | IFantasyTeamAthlete, roundNumber: number, seasonId: string) {
    
    const shouldFetch = Boolean(roundNumber && seasonId);
    
    const key = shouldFetch ? `/fantasy-athletes/${athlete.tracking_id}/athlete-points-breakdown?season_id=${seasonId}&round=${roundNumber}` : null;
    const { data, isLoading } = useSWR(key, () => fantasyAthleteService.getRoundPointsBreakdown(
        athlete.tracking_id,
        roundNumber,
        seasonId
    ), {
        refreshInterval: 1000 * 10 // Every minute
    });

    const pointItems = [...(data || [])].filter((f) => {
        return f.score !== 0
    }).sort((a, b) => {
        return (Math.abs(b.score ?? 0)) - Math.abs(a.score ?? 0);
    })

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