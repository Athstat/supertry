import { IFixture } from "../../types/games";
import { getAuthHeader, getUri } from "../../utils/backendUtils"
import { logger } from "../logger";

export const teamService = {
    getLastNFixtures: async (teamId: string, limit: number = 5) => {
        try {
            
            const uri = getUri(`/api/v1/teams/${teamId}/previous-games?limit=${limit}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFixture[];
            }

        } catch (err) {
            logger.error("Error fetching past n fixtures for team ", err);
        }

        return [];
    }
}