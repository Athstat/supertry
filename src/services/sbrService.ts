/** School Boy Rugby Service */

import { getAuthHeader, getUri } from "../utils/backendUtils"
import { logger } from "./logger";
import { ISbrBoxscoreItem, ISbrFixture, ISbrFixtureRosterItem, ISbrFixtureVote, UserPredictionsRanking } from "../types/sbr";
import { authService } from "./authService";

export const sbrService = {
    getAllFixtures: async (): Promise<ISbrFixture[]> => {
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

    getFixtureVotes: async (fixtureId: string): Promise<ISbrFixtureVote[]> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/votes`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
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
                body: JSON.stringify({ voteFor, userId: user?.id ?? "fall-back" })
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
                body: JSON.stringify({ voteFor, userId: user?.id ?? "fall-back" })
            });

            return await res.json();

        } catch (error) {
            logger.error(error);
        }

    },

    getPredictionsRanking: async (): Promise<UserPredictionsRanking[]> => {
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
    },

    getUserPredictionsRanking: async (userId: string) : Promise<UserPredictionsRanking | undefined> => {
        try {
            const uri = getUri(`/api/v1/sbr/predictions/rankings/${userId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
            return json;

        } catch (error) {
            logger.error("Error fetching predictions leaderboard " + error);
            return undefined;
        }
    },

    getFixtureById: async (fixtureId: string) : Promise<ISbrFixture | undefined> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
            return json;
            
        } catch (error) {
            logger.error("Error getting a fixture by id " + error);
            return undefined
        }
    },

    getFixtureBoxscoreById: async (fixtureId: string) : Promise<ISbrBoxscoreItem[]> => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/boxscore`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
            return json;
            
        } catch (error) {
            logger.error("Error getting sbr fixture boxscore " + error);
            return [];
        }
    },

    getFixtureRosters: async (fixtureId: string) => {
        try {
            
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/rosters`);
            
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json() as ISbrFixtureRosterItem[];

            return json;

        } catch (error) {
            logger.error("Error fetching match rosters ", error);
            return [];
        }
    }
}