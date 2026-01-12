import { SportAction } from "../types/sports_actions";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { logger } from "./logger";

export const athleteSportActionsService = {
  getByAthlete: async (athleteId: string) => {
    try {
      const uri = getUri(
        `/api/v1/sports-actions/aggregated/athletes/${athleteId}`
      );
      const res = await fetch(uri, {
        method: "GET",
        headers: getAuthHeader(),
      });

      return (await res.json()) as SportAction[];
    } catch (error) {
      logger.error("Error fetching athlete aggregate sports actions ", error);
      return [];
    }
  },
};
