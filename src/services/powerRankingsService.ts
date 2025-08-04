import { SingleMatchPowerRanking } from "../types/powerRankings";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { logger } from "./logger"

export const powerRankingsService = {
    getPastMatchsPowerRankings: async (athleteId: string, limit?: number) => {
        try {
            const queryParam = limit ? `?limit=${limit}` : '';
            const uri = getUri(`/api/v1/games/match-prs/athletes/${athleteId}${queryParam}`);
            
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json() as SingleMatchPowerRanking[];
            console.log("Past Matches ", json);

            return json;
        } catch (error) {
            console.log("Error fetching past match prs ", error);
            logger.error("Error fetching athlete matchs power rankings ", error);
            return [];
        }
    }
}