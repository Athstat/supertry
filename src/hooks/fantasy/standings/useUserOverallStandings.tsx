import useSWR from "swr";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";

/** Hook that fetches a users overall standings for a specific league */
export function useUserOverallStandings(userId?: string, leagueGroupId?: string) {
    const shouldFetch = userId && leagueGroupId;

    const key = shouldFetch ? `/fantasy-league-groups/${leagueGroupId}/members/${userId}` : null;
    const { data: userRanking, isLoading } = useSWR(key, () => fantasyLeagueGroupsService.getUserOverallRanking(leagueGroupId || "",  userId || ""));

    return {
        userRanking,
        isLoading
    }

}

export function useUserWeekRoundStanding(userId?: string, leagueGroupId?: string, roundNumber?: number) {
    const shouldFetch = userId && leagueGroupId && roundNumber;

    const key = shouldFetch ? `/fantasy-league-groups/${leagueGroupId}/members/${userId}/round/${roundNumber}` : null;
    const { data: userRanking, isLoading } = useSWR(key, () => fantasyLeagueGroupsService.getUserWeeklyStandings(leagueGroupId || "",  roundNumber || 1, userId || "", ));

    return {
        userRanking,
        isLoading
    }

}