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