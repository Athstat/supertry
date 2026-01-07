import { PickemOverallRankingItem } from "../types/pickem";
import { getAuthHeader, getUri } from "../utils/backendUtils"
import { logger } from "./logger";

export const pickemService = {
    getSeasonOverallRankings: async (seasonId: string): Promise<PickemOverallRankingItem[]> => {
        try {
            const uri = getUri(`/api/v1/pro/predictions/seasons/${seasonId}/rankings`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as PickemOverallRankingItem[];
            }
        } catch (err) {
            logger.error('Error getting season pick a season rank ', err)
        }

        return [];
    },

    getUserSeasonOverallRankings: async (seasonId: string, user_id: string): Promise<PickemOverallRankingItem | undefined> => {
        try {
            const uri = getUri(`/api/v1/pro/predictions/seasons/${seasonId}/rankings/${user_id}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as PickemOverallRankingItem;
            }
        } catch (err) {
            logger.error('Error getting season pick a season rank ', err)
        }

        return undefined;
    }
}