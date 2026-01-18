import { IProAthlete } from "../types/athletes";
import { IFixture } from "../types/games";
import { IProTeam } from "../types/team";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { logger } from "./logger"

export const competitionService = {

    /** Function to fetch for athelte that belong to a competition */
    getAthletes: async (competitionId: string | number) : Promise<IProAthlete[]> => {
        
        try {
            const uri = getUri(`/api/v1/competitions/${competitionId}/athletes`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            })

            if (res.ok) {
                return (await res.json()) as IProAthlete[];
            }

        } catch (err) {
            logger.error("Error fetching competition athletes ", err);
        }

        return [];
    },

    getTeams: async (competitionId: string | number) : Promise<IProTeam[]> => {

        try {
            const uri = getUri(`/api/v1/competitions/${competitionId}/teams`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProTeam[];
            }

        } catch (err) {
            logger.error("Error fetching competitions ", err);
        }

        return [];
    },

    getFixtures: async (competitionId: string | number) : Promise<IFixture[]> => {
        try {
            
            const uri = getUri(`/api/v1/competitions/${competitionId}/games`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFixture[];
            }

        } catch (err) {
            logger.error('Error fetching competition games ', err);
        }

        return [];
    }
}