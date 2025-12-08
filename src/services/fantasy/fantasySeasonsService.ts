import { IFantasySeason } from "../../types/fantasy/fantasySeason";
import { FantasyLeagueGroup, FantasyPointsScoredRankingItem, IPlayerPercentageSelected, MostSelectedRankingItem, PlayerPointsHistoryItem, PlayerSportActionRankingItem } from "../../types/fantasyLeagueGroups";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger";

export const fantasySeasonsService = {
    getAllFantasySeasons: async (is_active?: boolean): Promise<IFantasySeason[]> => {
        try {
            const queryParams = is_active ? `?is_active=${is_active}` : '';
            const uri = getUri(`/api/v1/fantasy-seasons${queryParams}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                const json = (await res.json());
                return json as IFantasySeason[];
            }
        } catch (err) {
            logger.error('Error fetcing fantasy seasons', err);
        }

        return [];
    },

    getFantasySeasonById: async (id: string): Promise<IFantasySeason | undefined> => {
        try {
            const uri = getUri(`/api/fantasy-seasons/${id}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                const json = (await res.json());
                return json as IFantasySeason;
            }
        } catch (err) {
            logger.error('Error fetcing fantasy seasons', err);
        }

        return undefined;
    },

    getFantasySeasonFeaturedLeagues: async (id: string) : Promise<FantasyLeagueGroup[]> => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${id}/fantasy-league-groups/featured`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroup[];
            }
        } catch (err) {
            logger.error('Error fetching featured fantasy league groups ', err);
        }

        return [];
    },

    /** Returns ranking of most selected players */
    getMostSelectedPlayers: async (id: string, limit: number = 5) : Promise<MostSelectedRankingItem[]> => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${id}/player-rankings/by-most-selected?limit=${limit}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            })

            if (res.ok) {
                return (await res.json()) as MostSelectedRankingItem[];
            }

        } catch (err) {
            logger.error('error fetching most seleted players ', err);
        }

        return [];
    },

    /** returns a ranking of players based on fantasy points scored */
    getFantasyPointsScoredRankings: async (id: string, limit: number = 5) : Promise<FantasyPointsScoredRankingItem[]> => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${id}/player-rankings/by-points-scored?limit=${limit}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            })

            if (res.ok) {
                return (await res.json()) as FantasyPointsScoredRankingItem[];
            }

        } catch (err) {
            logger.error('error fetching fantasy points score rankings ', err);
        }

        return [];
    },

    /** Returns player rankings for a specific sport action */
    getSportActionRankings: async (id: string, actionName: string, limit: number = 5) : Promise<PlayerSportActionRankingItem[]> => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${id}/player-rankings/by-sports-action/${actionName}?limit=${limit}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as PlayerSportActionRankingItem[];
            }
        } catch (err) {
            logger.error("Error fetching sport action ranking for ", actionName, err);
        }

        return [];
    },

    getPlayerPercentageSelected: async (seasonId: string, athleteId: string) : Promise<IPlayerPercentageSelected | undefined> => {
        try {

            const uri = getUri(`/api/v1/fantasy-seasons/${seasonId}/player-rankings/by-most-selected/${athleteId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
            });

            if (res.ok) {
                return (await res.json()) as IPlayerPercentageSelected
            }

        } catch (err) {
            logger.error("Error Player Percentage Selected ", err);
        }

        return undefined;
    },

    getPlayerPointsHistory: async (seasonId: string, athleteId: string, limit: number = 5) : Promise<PlayerPointsHistoryItem[]> => {
        try {
            const uri = getUri(`/api/v1/fantasy-seasons/${seasonId}/players/${athleteId}/points-history?limit=${limit}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as PlayerPointsHistoryItem[];
            }

        } catch (err) {
            logger.error(`Error getting player points history `, err);
        }

        return [];
    }
}