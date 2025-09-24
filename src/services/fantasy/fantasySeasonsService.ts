import { IFantasySeason } from "../../types/fantasy/fantasySeason";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger";

export const fantasySeasonsService = {
    getAllFantasySeasons: async (is_active?: boolean): Promise<IFantasySeason[]> => {
        try {
            const queryParams = is_active ? `?is_active=${is_active}` : '';
            const uri = getUri(`/api/fantasy-seasons${queryParams}`);
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
            const uri = getUri(`/api/v1/fantasy-seasons/${id}`);
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
    }
}