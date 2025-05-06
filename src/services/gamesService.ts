import { IFixture, IFullFixture } from "../types/games";
import { getAuthHeader, getUri } from "../utils/backendUtils"


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
    }
}