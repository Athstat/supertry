import { IProAthlete, IAthleteSeasonStarRatings } from "../../types/athletes";
import { SportAction } from "../../types/sports_actions";
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

    getAllAthletes: async (): Promise<IProAthlete[]> => {
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
    },

    getAthleteSportsActions: async (athleteId: string): Promise<SportAction[]> => {
        try {

            console.log("Fetching athlete sports aggregating actions ", athleteId)

            const uri = getUri(`/api/v1/athletes/${athleteId}/aggregated-stats`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as SportAction[];
            }

        } catch (error) {
            logger.error("Error fetching sports actions for ", athleteId, error)
        }

        return [];
    },

    getAthleteSeasonStarRatings: async (athleteId: string, seasonId: string): Promise<IAthleteSeasonStarRatings | undefined> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/stars/season/${seasonId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IAthleteSeasonStarRatings
            }

        } catch (e) {
            logger.error("Error getting athlete star ratings ", e);
        }

        return undefined;
    },

    getAthleteCareerStarRatings: async (athleteId: string): Promise<IAthleteSeasonStarRatings[]> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/stars`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IAthleteSeasonStarRatings[]
            }

        } catch (e) {
            logger.error("Error getting athlete star ratings ", e);
        }

        return [];
    }
}