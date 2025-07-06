/** Pro Predictions Ranking Service */

import { getAuthHeader, getUri } from "../utils/backendUtils"
import { authService } from "./authService";
import { logger } from "./logger";

export const proPredictionsRankingService = {
    getUserRanking: async (userId?: string) => {
        try {

            userId = userId ?? authService.getUserInfo()?.id;
            const uri = getUri(`/api/v1/pro-predictions/rankings/${userId}`);
            
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json())
            }

            return undefined;

        } catch (error) {
            logger.error('Error fetching user rankings ', error);
            return undefined;
        }
    },

    getAllUserRankings: async () => {
        try {
            const uri = getUri(`/api/v1/pro-predictions/rankings`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            })

            if (res.ok) {
                return (await res.json())
            }

            return []
        } catch (error) {
            logger.error('Error fetching rankings ', error);
            return [];
        }
    }
}