import useSWR from "swr";
import { fantasyLeagueGroupsService } from "../../services/fantasy/fantasyLeagueGroupsService";

/** a hook that fetches member rank detail for a user */
export function useMemberRankDetail(leagueGroupId: string, userId: string, fetch: boolean = true) {
    const key = fetch ? `/fantasy-league-groups/${leagueGroupId}/members/${userId}/ranking` : false; 
    const {data: rankingDetail, isLoading} = useSWR(key, () => fantasyLeagueGroupsService.getMemberRanking(leagueGroupId, userId));


    return {
        rankingDetail,
        isLoading
    }
}  