import { AthleteSportsActionAggregated } from "../types/sports_actions";
import { getAuthHeader } from "../utils/backendUtils";
import { baseUrl } from "./athleteService";

export const athleteSportActionsService = {
    getByAthlete: async (athleteId: string) => {
        try {
            const res = await fetch(
                `${baseUrl}/api/v1/sports-actions/aggregated/athletes/${athleteId}`,
                {
                    method: "GET",
                    headers: getAuthHeader(),
                }
            );

            return (await res.json()) as AthleteSportsActionAggregated[];
        } catch (error) {
            console.log("Error fetching athlete aggregate sports actions");
            return [];
        }
    }
}