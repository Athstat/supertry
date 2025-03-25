import { RugbyPlayer } from "../types/rugbyPlayer";

export const athleteService = {
  getRugbyAthletesByCompetition: async (
    competitionId: string
  ): Promise<RugbyPlayer[]> => {
    try {
      // Try to fetch from API first
      const baseUrl = "https://qa-games-app.athstat-next.com";

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
};
