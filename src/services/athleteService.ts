import { RugbyPlayer } from "../types/rugbyPlayer";

// Define the type for each individual breakdown item
export interface BreakdownItem {
  action: string;
  action_count: number;
  athlete_id: string;
  game_id: string;
  round: number;
  score: number;
}

export interface PointsBreakdown {
  total_points: number;
  breakdown: BreakdownItem[];
}

const baseUrl = "https://qa-games-app.athstat-next.com";

export const athleteService = {
  getRugbyAthletesByCompetition: async (
    competitionId: string
  ): Promise<RugbyPlayer[]> => {
    try {
      // Try to fetch from API first

      try {
        const response = await fetch(
          `${baseUrl}/api/v1/unauth/rugby-athletes-by-competition/${competitionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // Remove no-cors mode to see if it works
          }
        );

        if (response.ok) {
          return await response.json();
        }
      } catch (apiError) {
        console.error("API fetch error:", apiError);
        // Continue to fallback if API fetch fails
      }

      // If API fetch fails, use mock data
      console.log("Falling back to mock data");
      const mockData = await import("../data/rugbyPlayers");
      return mockData.rugbyPlayers;
    } catch (error) {
      console.error("Error in athleteService:", error);
      // Always return something to prevent app crash
      const mockData = await import("../data/rugbyPlayers");
      return mockData.rugbyPlayers;
    }
  },

  getAthletePointsBreakdown: async (
    athleteId: string
  ): Promise<PointsBreakdown> => {
    try {
      const access_token = localStorage.getItem("access_token");
      console.log("access_token", access_token);

      const response = await fetch(
        `${baseUrl}/api/v1/fantasy-athletes/fantasy-athletes/points-breakdown/${athleteId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("access_token") && {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }),
          },
        }
      );
      console.log("response", response);

      if (!response.ok) {
        throw new Error(`Failed to fetch points breakdown: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching athlete points breakdown:", error);
      throw error;
    }
  },
};
