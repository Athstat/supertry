import { IProAthlete } from "../../types/athletes";
import { getUri, getAuthHeader } from "../../utils/backendUtils";
import { logger } from "../logger";

/** Pro Athlete Service for django API */
export const djangoAthleteService = {

    getAthleteById: async (id: string): Promise<IProAthlete | undefined> => {

        try {
            const uri = getUri(`/api/v1/athletes/${id}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete;
            }

        } catch (err) {
            logger.error("Error fetching athletes ", err);
        }

        return undefined;
    },

    getAllAthletes: async () : Promise<IProAthlete[]> => {
        try {
            const uri = getUri('/api/v1/athletes');
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete[];
            }

        } catch (err) {
            logger.error("Error fetching athletes ", err);
        }

        return [];
    }
}