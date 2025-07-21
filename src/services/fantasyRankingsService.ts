import { UserRanking } from "../types/userRanking";
import { getAuthHeader, getUri } from "../utils/backendUtils"

export const fantasyRankingsService = {

    getUserRankings: async (start?: number, end?: number) => {

        try {
            const queryParams = start && end ? `?start=${Number.parseInt(start.toString())}&end=${Number.parseInt(end.toString())}` : "";
            const url = getUri(`/api/v1/fantasy/user-rankings/${queryParams}`);

            const res = await fetch(url, {
                headers: getAuthHeader(),
                cache: "no-store"
            });

            const json = await res.json();

            return json as UserRanking[];
        } catch (error) {
            console.log("Error fetching user rankings ", error);
            return undefined;
        }
    },

    getUserRankingByUserId: async (userId: string) => {

        try {
            const uri = getUri(`/api/v1/fantasy/user-rankings/${userId}`);
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