import { GameSportAction, IBoxScoreItem } from "../types/boxScore";
import { getAuthHeader, getUri } from "../utils/backendUtils"

export const boxScoreService = {
    getBoxScoreByGameId: async (gameId: string) => {
        try {

            const uri = getUri(`/api/v1/games/${gameId}/boxscore`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = (await res.json()) as IBoxScoreItem[];
            // console.log("Box Score ", json);
            return json;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    },

    getSportActionsByGameId: async (gameId: string) => {
        try {

            const uri = getUri(`/api/v1/games/${gameId}/sport-actions`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = (await res.json()) as GameSportAction[];
            return json;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
}