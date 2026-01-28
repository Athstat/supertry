import { IProAthlete } from "../../types/athletes";
import { IFixture } from "../../types/fixtures";
import { IProTeam, TeamSeasonLeader } from "../../types/team";
import { getAuthHeader, getUri } from "../../utils/backendUtils"
import { logger } from "../logger";

export const teamService = {
    getTeamById: async (teamId: string): Promise<IProTeam | undefined> => {
        try {
            const uri = getUri(`/api/v1/teams/${teamId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProTeam;
            }
        } catch (err) {
            logger.error("Error fetching team by id ", err);
        }

        return undefined;
    },

    getLastNFixtures: async (teamId: string, limit: number = 5) => {
        try {

            const uri = getUri(`/api/v1/teams/${teamId}/previous-games?limit=${limit}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFixture[];
            }

        } catch (err) {
            logger.error("Error fetching past n fixtures for team ", err);
        }

        return [];
    },

    getTeamSeasonLeaders: async (teamId: string, seasonId: string) => {

        try {
            const uri = getUri(`/api/v1/teams/${teamId}/seasons/${seasonId}/stats/leaders`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as TeamSeasonLeader[]
            }
        } catch (err) {
            logger.error("Errir fetching team season leader ", err);
        }

        return [];
    },

    getAthletesByCompetition: async (teamId: string, competitionId?: string | number): Promise<IProAthlete[]> => {
        try {
            const searchParams = competitionId ? `?competition_id=${competitionId}` : '';
            const uri = getUri(`/api/v1/teams/${teamId}/athletes${searchParams}`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete[];
            }

        } catch (err) {
            logger.error("Error fetching team athletes ", err);
        }

        return [];
    },

    getAthletesBySeason: async (teamId: string, seasonId?: string | number): Promise<IProAthlete[]> => {
        try {
            const searchParams = seasonId ? `?season_id=${seasonId}` : '';
            const uri = getUri(`/api/v1/teams/${teamId}/athletes${searchParams}`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete[];
            }

        } catch (err) {
            logger.error("Error fetching team athletes ", err);
        }

        return [];
    }
}

