import { IFantasyLeagueScoringOverview, IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { UpdateFantasyLeagueTeam } from "../../types/fantasyLeagueTeam";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger"

export const fantasySeasonTeamService = {
    getRoundTeam: async (seasonId: string, userId: string, roundNumber: number | number) => {
        try {
            
            const uri = getUri(`/api/v1/fantasy-seasons/${seasonId}/users/${userId}/teams/${roundNumber}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFantasyLeagueTeam;
            }

        } catch (err) {
            logger.error('Error fetching user round team ', err);
        }

        return undefined;
    },

    updateRoundTeam: async (seasonId: string, userId: string, roundNumber: string | number, data: UpdateFantasyLeagueTeam) => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${seasonId}/users/${userId}/teams/${roundNumber}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'PUT',
                body: JSON.stringify(data)
            });

            if (res.ok) {
                return (await res.json()) as IFantasyLeagueTeam
            }

        } catch (err) {
            logger.error("Error updating user fantasy round team ", err);
        }

        return undefined;
    },

    createRoundTeam: async (seasonId: string, userId: string, roundNumber: string | number, data: UpdateFantasyLeagueTeam) => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${seasonId}/users/${userId}/teams/${roundNumber}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (res.ok) {
                return (await res.json()) as IFantasyLeagueTeam
            }

        } catch (err) {
            logger.error("Error updating user fantasy round team ", err);
        }

        return undefined;
    },

    getRoundScoringSummary: async (seasonId: string, userId: string, roundNumber: string | number) => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${seasonId}/users/${userId}/teams/${roundNumber}/scoring/overview`);
            
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFantasyLeagueScoringOverview;
            }

        } catch (err) {
            logger.error("Error fetching round scoring summary ", err);
        }

        return undefined;
    }
}