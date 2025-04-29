import {
  IFantasyTeamAthlete,
  IFantasyClubTeam,
} from "../types/fantasyTeamAthlete";

export const teamService = {
  /**
   * Fetch the user's club information
   */
  fetchUserClub: async () => {
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

      // Make API request to get user's club
      const response = await fetch(
        `${baseUrl}/api/v1/fantasy-teams/fantasy-clubs/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch user club:", await response.text());
        return null;
      }

      const data = await response.json();

      // Return the first club if available
      if (data && data.length > 0) {
        return data[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user club:", error);
      return null;
    }
  },

  /**
   * Fetch all teams for the current user
   */
  fetchUserTeams: async (
    officialLeagueId: string
  ): Promise<IFantasyClubTeam[]> => {
    try {
      const baseUrl = "https://qa-games-app.athstat-next.com";

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

      //const defaultLeagueId = "d313fbf5-c721-569b-975d-d9ec242a6f19";

      // Construct the URL based on whether leagueId is provided
      const url = `${baseUrl}/api/v1/fantasy-teams/${userId}/${officialLeagueId}`;

      // Make API request to get user's teams
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch user teams:", await response.text());
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user teams:", error);
      return [];
    }
  },

  /**
   * Submit a fantasy team to the server
   */
  submitTeam: async (
    teamName: string,
    teamAthletes: IFantasyTeamAthlete[],
    leagueId: string
  ): Promise<IFantasyClubTeam> => {
    try {
      // Always use the production URL for this endpoint since it's not available in local dev
      const baseUrl = "https://qa-games-app.athstat-next.com";

      // Get user ID from token (or use a default if not available)
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      let userId = "default-user-id";
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub || userId;
      } catch (error) {
        console.error("Error extracting user ID from token:", error);
      }

      // Fetch the user's club - use direct reference to the function
      const club = await teamService.fetchUserClub();

      // Throw error if club not found
      if (!club || !club.id) {
        throw new Error(
          "Unable to retrieve your club information. Please try again later."
        );
      }

      // Prepare the request payload
      const payload = {
        clubId: club.id,
        leagueId: leagueId,
        name: teamName,
        team: teamAthletes,
      };

      console.log("Payload: ", payload);

      // Submit the team to the server
      const response = await fetch(
        `${baseUrl}/api/v1/fantasy-athletes/fantasy-team-athletes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to submit team:", errorText);
        throw new Error(
          `Failed to submit team: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in teamService.submitTeam:", error);
      throw error;
    }
  },

  /**
   * Fetch athletes for a specific team
   */
  fetchTeamAthletes: async (teamId: string): Promise<IFantasyTeamAthlete[]> => {
    try {
      const baseUrl = import.meta.env.PROD
        ? "https://qa-games-app.athstat-next.com"
        : "";

      // Get token for authentication
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      // Make API request to get team athletes
      const response = await fetch(
        `${baseUrl}/api/v1/fantasy-athletes/fantasy-team-athletes/${teamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch team athletes:", await response.text());
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching team athletes:", error);
      return [];
    }
  },
};
