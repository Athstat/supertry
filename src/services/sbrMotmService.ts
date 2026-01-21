import { IEditSbrMotmVoteReq, INewSbrMotmVoteReq, ISbrMotmVote } from "../types/sbr";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { authService } from "./authService";
import { logger } from "./logger"

export const sbrMotmService = {
    getUserVote: async (fixtureId: string) => {
        try {

            const userId = (await authService.getUserInfo())?.kc_id ?? "fall-back-id";
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/motm/votes/by-user/${userId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                const json = (await res.json()) as ISbrMotmVote;
                return json;
            }

        } catch (error) {
            logger.error('Error fetching user vote ', error);
        }
        
        return undefined;
    },

    postMotmVote: async (fixtureId: string, athleteId: string, teamId: string) => {
        try {
            const userId = (await authService.getUserInfo())?.kc_id ?? "fallback-id"
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/motm/votes`);

            const reqBody: INewSbrMotmVoteReq = {
                "userId": userId,
                "teamId": teamId,
                "athleteId": athleteId
            }

            const res = await fetch(uri, {
                headers: getAuthHeader(),
                body: JSON.stringify(reqBody),
                method: "POST"
            });

            const json = (await res.json()) as ISbrMotmVote;
            return json;

        } catch (error) {
            logger.error('Error creating an sbr motm vote', error);
            return undefined;
        }
    },

    changeMotmVote: async (fixtureId: string, athleteId: string, teamId: string) => {
        try {
            const userId = (await authService.getUserInfo())?.kc_id ?? "fallback-id"
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/motm/votes/by-user/${userId}`);

            const reqBody: IEditSbrMotmVoteReq = {
                "teamId": teamId,
                "athleteId": athleteId
            }

            const res = await fetch(uri, {
                headers: getAuthHeader(),
                body: JSON.stringify(reqBody),
                method: "PUT"
            });

            const json = (await res.json()) as ISbrMotmVote;
            return json;

        } catch (error) {
            logger.error('Error creating an sbr motm vote', error);
            return undefined;
        }
    },

    /** Gets all the Motm votes that have been made for a fixture */
    getFixtureMotmVotes: async (fixtureId: string) => {
        try {
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/motm/votes`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as ISbrMotmVote[];
            }

        } catch (error) {
            logger.error('Error fetching motm votes for fixture', error);
        }

        return undefined;
    }
}