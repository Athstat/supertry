import { ScoutingListPlayer } from "../../types/fantasy/scouting";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger"

export const scoutingService = {
    getUserList: async (): Promise<ScoutingListPlayer[]> => {
        try {
            const uri = getUri(`/api/v1/fantasy/scouting/my-list`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as ScoutingListPlayer[];
            }
        } catch (err) {
            logger.error('Error fetching user scouting list ', err);
        }

        return [];
    },

    getScoutingListPlayer: async (athleteId: string): Promise<ScoutingListPlayer | undefined> => {
        try {
            
            const uri = getUri(`/api/v1/fantasy/scouting/my-list/${athleteId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                const json = await res.json();
                return (json) as ScoutingListPlayer;
            }

        } catch (err) {
            logger.error("Error getting scouting list player ", err);
        };

        return undefined
    },

    removePlayer: async (athleteId: string): Promise<void> => {
        try {
            const uri = getUri(`/api/v1/fantasy/scouting/my-list/${athleteId}`);
            await fetch(uri, {
                headers: getAuthHeader(),
                method: "DELETE"
            });
        } catch (err) {
            logger.error("Error removing player from scouting list ", err);
        }
    },

    addPlayer: async (athleteId: string): Promise<ScoutingListPlayer | undefined> => {
        try {
            const uri = getUri(`/api/v1/fantasy/scouting/my-list`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                body: JSON.stringify({
                    athlete_id: athleteId
                }),
                method: 'POST'
            });

            if (res.ok) {
                return (await res.json()) as ScoutingListPlayer;
            }
        } catch (err) {
            logger.error("Error adding player to scouting list ", err);
        }
    }
}