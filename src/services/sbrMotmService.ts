import { INewSbrMotmVoteReq, ISbrMotmVote } from "../types/sbr";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { authService } from "./authService";
import { logger } from "./logger"

export const sbrMotmService = {
    getUserVote: async (fixtureId: string) => {
        try {

            const userId = authService.getUserInfo()?.id ?? "fall-back-id";
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/motm/votes/by-user/${userId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = (await res.json()) as ISbrMotmVote;
            return json;
        } catch (error) {
            logger.error('Error fetching user vote ', error);
            return undefined;
        }
    },

    postMotmVote: async (fixtureId: string, athleteId: string, teamId: string) => {
        try {
            const userId = authService.getUserInfo()?.id ?? "fallback-id"
            const uri = getUri(`/api/v1/sbr/fixtures/${fixtureId}/motm/votes`);

            const reqBody: INewSbrMotmVoteReq = {
                "userId": userId,
                "teamId": teamId,
                "athleteId": athleteId
            }

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = (await res.json()) as ISbrMotmVote;
            return json;

        } catch (error) {
            logger.error('Error creating an sbr motm vote', error);
            return undefined;
        }
    }
}