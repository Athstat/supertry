/** School Boy Rugby Service */

import { getAuthHeader, getUri } from "../utils/backendUtils"
import { logger } from "./logger";
import { ISbrFixture } from "../types/sbr";

export const sbrService = {
    getAllMatches: async () : Promise<ISbrFixture[]> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json() as ISbrFixture[];
            console.log("Matches SBR ", json);

            return json;
        } catch (error) {
            logger.error(error);
            return []
        }
    }
}