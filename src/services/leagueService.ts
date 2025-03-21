import { IFantasyLeague } from "../types/fantasyLeague";
import { IGamesLeagueConfig } from "../types/leagueConfig";

export const leagueService = {
  getAllLeagues: async (): Promise<IFantasyLeague[]> => {
    try {
      // Use the same base URL pattern as other services
      const baseUrl = import.meta.env.PROD
        ? "https://qa-games-app.athstat-next.com"
        : "";

      try {
        const response = await fetch(`${baseUrl}/api/v1/fantasy-leagues`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization if needed
            ...(localStorage.getItem("access_token") && {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }),
          },
        });

        if (response.ok) {
          return await response.json();
        } else {
          console.error("Failed to fetch leagues:", await response.text());
          throw new Error("Failed to fetch leagues");
        }
      } catch (apiError) {
        console.error("API fetch error:", apiError);
        // Return empty array if API fetch fails
        return [];
      }
    } catch (error) {
      console.error("Error in leagueService:", error);
      return [];
    }
  },

  getLeagueConfig: async (
    officialLeagueId: string
  ): Promise<IGamesLeagueConfig | null> => {
    try {
      const baseUrl = import.meta.env.PROD
        ? "https://qa-games-app.athstat-next.com"
        : "";

      try {
        const response = await fetch(
          `${baseUrl}/api/v1/unauth/fantasy-league-config/${officialLeagueId}`,
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

        if (response.ok) {
          return await response.json();
        } else {
          console.error(
            "Failed to fetch league config:",
            await response.text()
          );
          throw new Error("Failed to fetch league config");
        }
      } catch (apiError) {
        console.error("API fetch error:", apiError);
        return null;
      }
    } catch (error) {
      console.error("Error in leagueService.getLeagueConfig:", error);
      return null;
    }
  },
};
