import { UserRanking } from "../types/userRanking";
import { getAuthHeader, getUri } from "../utils/backendUtils"

export const userRankingsService = {

    getUserRankings: async (start?: number, end?: number) => {

        try {
            const queryParams = start && end ? `?start=${Number.parseInt(start.toString())}&end=${Number.parseInt(end.toString())}` : "";
            const url = getUri(`/api/v1/rankings/users${queryParams}`);

            const res = await fetch(url, {
                headers: getAuthHeader()
            });

            const json = await res.json();

            return json as UserRanking[];
        } catch (error) {
            console.log("Error fetching user rankings", error);
            return [];
        }
    },

    getUserRankingByUserId: async (userId: string) => {

        try {
            const uri = getUri(`/api/v1/rankings/users/${userId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            const json = await res.json();
            return json as UserRanking;

        } catch (error) {
            console.log("Error fetching user rankings ", error);
            return undefined;
        }
    }
}