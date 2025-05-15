/** School Boy Rugby Service */

import { getAuthHeader, getUri } from "../utils/backendUtils"
import { logger } from "./logger";
import { ISbrFixture, ISbrFixtureVote } from "../types/sbr";

export const sbrService = {
    getAllMatches: async () : Promise<ISbrFixture[]> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json() as ISbrFixture[];

            return json;
        } catch (error) {
            logger.error(error);
            return []
        }
    },

    getMatchVotes: async (fixtureId: string) : Promise<ISbrFixtureVote[]> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/votes`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json() ;
            console.log(json);
            return json;

        } catch (error) {
            logger.error(error);
            return [];
        }
    }
}