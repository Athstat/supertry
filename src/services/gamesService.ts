import { IFixture, IFullFixture, IRosterItem } from "../types/games";
import { getAuthHeader, getUri } from "../utils/backendUtils"
import { logger } from "./logger";


/** Games Service */
export const gamesService = {

    getUpcomingGamesByCompetitionId: async (competitionId: string) : Promise<IFixture[]> => {
        const uri = getUri(`/api/v1/entities/games-upcoming/${competitionId}`);
        
        try {
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            return await res.json() as IFixture[];

        } catch (err) {
            console.log("Error fetching games", err)
            return [];
        }
    },

    getGamesByCompetitionId: async (competitionId: string) : Promise<IFixture[]> => {
        const uri = getUri(`/api/v1/games/leagues/${competitionId}`);
        
        try {
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            return await res.json() as IFixture[];

        } catch (err) {
            console.log("Error fetching games", err)
            return [];
        }

    },

    getGameById: async (gameId: string) : Promise<IFullFixture | undefined> => {
        const uri = getUri(`/api/v1/games/${gameId}`);
        
        try {
            const res = await fetch(uri, {
            });

            return await res.json() as IFixture;

        } catch (err) {
            console.log("Error fetching games", err)
            return undefined;
        }
    },

    getGamesByDate: async (date: Date) => {
        try {
            const uri = getUri(`/api/v1/unauth/matches-all/${date.toISOString()}`);
            const res = await fetch(uri);

            const json = (await res.json()) as IFixture[];

            return json;
        } catch(error) {
            logger.error("Error getting games " + error);
            return [];
        }
    },

    /** Gets roster items for a single game */
    getGameRostersById: async (gameId: string) : Promise<IRosterItem[]> => {
        try {
            const uri = getUri(`/api/v1/games/${gameId}/rosters`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
            return json;

        } catch (error) {
            logger.error("Failed to get game rosters " + error);
            return [];
        }
    } 
}