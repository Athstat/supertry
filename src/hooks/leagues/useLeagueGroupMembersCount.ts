import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../../services/fantasy/fantasyLeagueGroupsService";

/** React Hook that gets the number of members in a league */
export function useLeagueGroupMembersCount(leagueId?: string) {
    const key = leagueId ? swrFetchKeys.getFantasyLeagueGroupMembers(leagueId) : null;
    const {data, isLoading} = useSWR(key, () => fantasyLeagueGroupsService.getGroupMembers(leagueId || ''));

    const formatter = new Intl.NumberFormat('en-US', { notation: 'compact' });
    const count = (data || []).length;
    const formattedCount = formatter.format(count);

    return {
        count, isLoading, formattedCount
    }
} 