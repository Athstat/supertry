import { IEditProMotm, INewProMotm, IProMotmVote } from "../types/proMotm";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { logger } from "./logger";

export const proMotmService = {

    createVote: async (data: INewProMotm) => {
        try {
            const uri = getUri(`/api/v1/games/motm-votes`);

            const res = await fetch(uri, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(data)
            });

            if (res.ok) {
                return (await res.json()) as IProMotmVote[];
            }

            return  undefined;

        } catch (error) {
            logger.error('Error creating vote')
            return undefined;
        }
    },

    getGameVote: async (gameId: string) => {
        try {
            const uri = getUri(`/api/v1/games/${gameId}/motm-votes`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
            });

            if (res.ok) {
                return (await res.json()) as IProMotmVote[];
            }

        } catch (error) {
            logger.error('Error creating vote')
        }

        return [];
    },

    getUserGameVote: async (gameId: string, userId: string) => {
        try {
            const uri = getUri(`/api/v1/games/${gameId}/motm-votes/${userId}`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
            });

            if (res.ok) {
                return (await res.json()) as IProMotmVote;
            }

        } catch (error) {
            logger.error('Error creating vote')
        }

        return [];
    },

    editUserGameVote: async (gameId: string, userId: string, data: IEditProMotm) => {
        try {
            const uri = getUri(`/api/v1/games/${gameId}/motm-votes/${userId}`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
                body: JSON.stringify(data),
                method: 'PUT'
            });

            if (res.ok) {
                return (await res.json()) as IProMotmVote[];
            }
            
        } catch (error) {
            logger.error('Error creating vote')
        }

        return undefined;
    },

    deleteUserGameVote: async (gameId: string, userId: string) => {
        try {
            const uri = getUri(`/api/v1/games/${gameId}/motm-votes/${userId}`);

            await fetch(uri, {
                headers: getAuthHeader(),
                method: 'DELETE'
            });

        } catch (error) {
            logger.error('Error creating vote')
        }
    },
    

}
