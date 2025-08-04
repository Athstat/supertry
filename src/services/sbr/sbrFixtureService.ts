import { ISbrFixtureStatsStatus } from "../../types/sbr";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger"

export const sbrFixtureService = {
    
    getFixtureStatsStatus: async (fixtureId: string) : Promise<ISbrFixtureStatsStatus | undefined> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/stats/status`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as ISbrFixtureStatsStatus;
            }
        } catch (e) {
            logger.error("Error getting sbr fixture stats status", e);
        }

        return undefined;
    }
}