import { IFantasyLeague, IFantasyLeagueTeam } from "../types/fantasyLeague";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { getUri } from "../utils/backendUtils";
import { analytics } from "./anayticsService";
import { fantasyTeamService } from "./teamService";

export const leagueService = {
  getAllLeagues: async (): Promise<IFantasyLeague[]> => {
    try {

      const uri = getUri(`/api/v1/fantasy-leagues`);

      try {
        const response = await fetch(uri, {
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

  /**
   * Fetch a league by its ID
   */
  getLeagueById: async (leagueId: number): Promise<IFantasyLeague | null> => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      console.log("getting leagues: ", baseUrl);

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      const response = await fetch(
        getUri(`/api/v1/fantasy-leagues/${leagueId}`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch league:", await response.text());
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching league by ID:", error);
      return null;
    }
  },

  /**
   * Fetch participating teams for a league
   */
  fetchParticipatingTeams: async (
    leagueId: string | number
  ): Promise<IFantasyLeagueTeam[]> => {
    try {

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }
      
      const uri = getUri(`/api/v1/fantasy-leagues/participating-teams-with-user-athletes/${leagueId}`);

      const response = await fetch(uri, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch participating teams:",
          await response.text()
        );
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching participating teams:", error);
      return [];
    }
  },

  getLeagueConfig: async (
    officialLeagueId: string
  ): Promise<IGamesLeagueConfig | null> => {
    try {

      const uri = getUri(`/api/v1/unauth/fantasy-league-config/${officialLeagueId}`);

      try {
        const response = await fetch( uri, {
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

      //console.log("League for joining: ", league);

      // // Fetch the user's latest team
      const userTeams = await fantasyTeamService
        .fetchUserTeams
        // league.official_league_id
        ();

      if (!userTeams || userTeams.length === 0) {
        throw new Error("Could not find your team. Please try again.");
      }

      //console.log("User teams: ", userTeams);

      // Use the most recently created team (assuming it's the one we just submitted)
      const latestTeam = userTeams.reduce(
        (highest, team) => (team.id > highest.id ? team : highest),
        userTeams[0]
      );

      const uri = getUri(`/api/v1/fantasy-leagues/join-league`);

      const response = await fetch(uri, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            team: latestTeam,
            league: league,
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

      analytics.trackTeamCreationCompleted(
        league.id,
        latestTeam.id,
        league.official_league_id
      );

      return await response.json();
    } catch (error) {
      console.error("Error in leagueService.joinLeague:", error);
      throw error;
    }
  },

  /**
   * Check if the current user has joined a specific league
   * Used both methods and consolidated them into one
   */
  checkUserLeagueStatus: async (leagueId: string): Promise<boolean> => {
    try {
      // Try the first approach - look for user teams in the league
      try {
        const userTeams = await fantasyTeamService
          .fetchUserTeams
          // leagueId
          ();
        // If the user has any teams in this league, they've joined it
        if (userTeams.length > 0) {
          return true;
        }
      } catch (error) {
        console.log("First approach failed, trying second approach", error);
      }

      // Get token for authentication
      const token = localStorage.getItem("access_token");
      if (!token) return false;

      // Extract user ID from token
      let userId;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub;
      } catch (error) {
        console.error("Error extracting user ID from token:", error);
        return false;
      }

      // Fetch participating teams for this league
      const participatingTeams = await leagueService.fetchParticipatingTeams(
        leagueId
      );

      // Check if any team belongs to the current user
      return participatingTeams.some((team) => team.kc_id === userId);
    } catch (error) {
      console.error(
        `Error checking user status for league ${leagueId}:`,
        error
      );
      return false;
    }
  },
};
