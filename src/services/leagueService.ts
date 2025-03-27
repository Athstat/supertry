import { IFantasyLeague } from "../types/fantasyLeague";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { teamService } from "./teamService";

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

  joinLeague: async (league: any): Promise<any> => {
    try {
      const baseUrl = import.meta.env.PROD
        ? "https://qa-games-app.athstat-next.com"
        : "";

      // Get user ID from token
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      // Extract user ID from token
      let userId = "default-user-id";
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub || userId;
      } catch (error) {
        console.error("Error extracting user ID from token:", error);
        throw new Error(
          "Could not determine user identity. Please log in again."
        );
      }

      // Fetch the user's latest team
      const userTeams = await teamService.fetchUserTeams(
        league.official_league_id
      );

      if (!userTeams || userTeams.length === 0) {
        throw new Error("Could not find your team. Please try again.");
      }

      // Use the most recently created team (assuming it's the one we just submitted)
      const latestTeam = userTeams[userTeams.length - 1];

      // Make API request to join the league
      const response = await fetch(
        `${baseUrl}/api/v1/fantasy-leagues/join-league`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            team: latestTeam,
            league,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to join league:", errorText);
        throw new Error(
          `Failed to join league: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in leagueService.joinLeague:", error);
      throw error;
    }
  },
};
