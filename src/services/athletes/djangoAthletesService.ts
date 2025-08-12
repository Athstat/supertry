import { IProAthlete, IAthleteSeasonStarRatings } from "../../types/athletes";
import { IProSeason } from "../../types/season";
import { SportAction } from "../../types/sports_actions";
import { getUri, getAuthHeader } from "../../utils/backendUtils";
import { mapSportsActionToAthstatName } from "../../utils/sportsActionUtils";
import { logger } from "../logger";

/** Pro Athlete Service for django API */
export const djangoAthleteService = {

    getAthleteById: async (id: string): Promise<IProAthlete | undefined> => {

        try {
            const uri = getUri(`/api/v1/athletes/${id}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete;
            }

        } catch (err) {
            logger.error("Error fetching athletes ", err);
        }

        return undefined;
    },

    getAllAthletes: async (): Promise<IProAthlete[]> => {
        try {
            const uri = getUri('/api/v1/athletes/');
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete[];
            }

        } catch (err) {
            logger.error("Error fetching athletes ", err);
        }

        return [];
    },

    getAthleteSportsActions: async (athleteId: string): Promise<SportAction[]> => {
        try {

            console.log("Fetching athlete sports aggregating actions ", athleteId)

            const uri = getUri(`/api/v1/athletes/${athleteId}/aggregated-stats`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                const actions = (await res.json()) as SportAction[];
                const fixedActions: SportAction[] = actions.map((a) => {
                    return {
                        action: mapSportsActionToAthstatName(a.action),
                        athlete_id: a.athlete_id,
                        action_count: a.action_count,
                        season_id: a.season_id,
                        season: a.season
                    }
                })

                return fixedActions;
            }

        } catch (error) {
            logger.error("Error fetching sports actions for ", athleteId, error)
        }

        return [];
    },

    getAthleteSeasonStarRatings: async (athleteId: string, seasonId: string): Promise<IAthleteSeasonStarRatings | undefined> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/stars/season/${seasonId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IAthleteSeasonStarRatings
            }

        } catch (e) {
            logger.error("Error getting athlete star ratings ", e);
        }

        return undefined;
    },

    getAthleteCareerStarRatings: async (athleteId: string): Promise<IAthleteSeasonStarRatings[]> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/stars`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IAthleteSeasonStarRatings[]
            }

        } catch (e) {
            logger.error("Error getting athlete star ratings ", e);
        }

        return [];
    },

    getAthleteSeasons: async (athleteId: string): Promise<IProSeason[]> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/seasons`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProSeason[];
            }

        } catch (err) {
            console.log("Error fetching athlete seasons");
        }

        return [];
    },

    getAthleteSeasonStats: async (athleteId: string, season_id: string): Promise<SportAction[]> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/seasons/${season_id}/stats`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as SportAction[];
            }

        } catch (err) {
            console.log(`Error fetching athlete season stats for ${season_id}`);
        }

        return [];
    },

    getAthleteSeasonStaarRatings: async (athleteId: string, season_id: string): Promise<IAthleteSeasonStarRatings | undefined> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/seasons/${season_id}/stars`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IAthleteSeasonStarRatings;
            }

        } catch (err) {
            console.log(`Error fetching athlete season stats for ${season_id}`);
        }

        return undefined;
    },

    getAthleteTeamMates: async (athleteId: string, limit?: number): Promise<IProAthlete[]> => {
        try {

            const uri = getUri(`/api/v1/athletes/${athleteId}/team-mates?limit=${limit ?? 10}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IProAthlete[];
            }

        } catch (err) {
            console.log(`Error fetching athlete team mates for ${athleteId}`);
        }

        return [];
    },
}