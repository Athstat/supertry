import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";
import { useMemo } from "react";

/** Hook for fetching a teams season record, with and loss data,
 * @param teamId the team's athstat id
 * @param seasoId the season id for which to get a teams record 
 */
export function useTeamSeasonRecord(teamId: string, seasonId: string) {
    const key = `/seasons/${seasonId}/teams/${teamId}/record`;
    const {data: record, isLoading} = useSWR(key, () => seasonService.getTeamSeasonRecord(seasonId, teamId));

    const recordText = useMemo<string | undefined>(() => {
        if (!record) {
            return;
        }
        
        const {wins, losses, draws} = record;

        if (draws > 0) {
            return `${wins}-${draws}-${losses}`;
        }

        return `${wins} - ${losses}`;
    }, [record]);

    return {
        record, isLoading, recordText
    }
}