/** School Boy Rugby Service */

import { getAuthHeader, getUri } from "../utils/backendUtils"
import { logger } from "./logger";
import { ISbrFixture, ISbrFixtureVote, UserPredictionsRanking } from "../types/sbr";
import { authService } from "./authService";

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
    },

    postSbrFixtureVote: async (fixture_id: string, voteFor: "home_team" | "away_team") => {
        
        try {
            const user = authService.getUserInfo();
            const uri = getUri(`/api/v1/sbr/fixtures/${fixture_id}/votes`);

            const res = await fetch(uri, {
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify({voteFor, userId: user?.id ?? "fall-back"})
            });

            return await res.json();

        } catch (error) {
            logger.error(error);
        }
        
    },

    putSbrFixtureVote: async (fixture_id: string, voteFor: "home_team" | "away_team") => {
        
        try {
            const user = authService.getUserInfo();
            const uri = getUri(`/api/v1/sbr/fixtures/${fixture_id}/votes`);

            const res = await fetch(uri, {
                method: "PUT",
                headers: getAuthHeader(),
                body: JSON.stringify({voteFor, userId: user?.id ?? "fall-back"})
            });

            return await res.json();

        } catch (error) {
            logger.error(error);
        }
        
    },

    getPredictionsLeaderboard: async () : Promise<UserPredictionsRanking[]> => {
        try {

            const uri = getUri(`/api/v1/sbr/predictions/rankings`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
            return json;

        } catch (error) {
            logger.error("Error fetching predictions leaderboard " + error);
            return [];
        }
    }
}