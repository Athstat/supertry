import {
  IFantasyTeamAthlete,
  IFantasyClubTeam,
  IUpdateFantasyTeamAthleteItem,
  ICreateFantasyTeamAthleteItem,
} from "../types/fantasyTeamAthlete";
import { getAuthHeader, getUri } from "../utils/backendUtils";
import { authService } from "./authService";

export const fantasyTeamService = {
  /**
   * Update team athletes for a fantasy team
   */
  updateTeamAthletes: async (
    team: IUpdateFantasyTeamAthleteItem[],
    teamId: string
  ): Promise<any> => {
    try {


      const uri = getUri(`/api/v1/fantasy-athletes/fantasy-team-athletes/update-team-athletes`);

      const response = await fetch(uri, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify({ team, teamId }),
      });

      if (!response.ok) {
        console.error("Failed to update team athletes:", await response.text());
        throw new Error(
          `Failed to update team: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating team athletes:", error);
      throw error;
    }
  },

  /**
   * Fetch the user's club information
   */
  fetchUserClub: async () => {
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

      // Make API request to get user's club
      const uri = getUri(`/api/v1/fantasy-teams/fantasy-clubs/${userId}`);

      const response = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
  fetchUserTeams: async (id?: string): Promise<IFantasyClubTeam[]> => {
    try {

      let userId = id || authService.getUserInfo()?.id || "default-user-id";
      const url = getUri(`/api/v1/fantasy-teams/fantasy-teams-all/${userId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeader()
      });

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
    teamAthletes: ICreateFantasyTeamAthleteItem[],
    leagueId: string
  ): Promise<IFantasyClubTeam> => {
    try {

      const club = await fantasyTeamService.fetchUserClub();

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
      const uri = getUri(`/api/v1/fantasy-athletes/fantasy-team-athletes`);

      const response = await fetch(uri, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to submit team:", errorText);
        throw new Error(
          `Failed to submit team: ${response.status} ${response.statusText}`
        );
      }

      return club;
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
      // Get token for authentication
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      // Make API request to get team athletes
      const uri = getUri(
        `/api/v1/fantasy-athletes/fantasy-team-athletes/${teamId}`
      );

      const response = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  /** Gets a users team by its id and user id */
  getUserTeamById: async (teamId: string, userId?: string) => {
    try {

      const userTeams = await fantasyTeamService.fetchUserTeams(userId);
      let currentTeam = userTeams.find((t) => t.id == teamId);

      return currentTeam;

    } catch (error) {
      console.log("Error fetching user team");
      return undefined;
    }
  },

  /**
   * Update a player as team captain
   * @param teamId The ID of the team
   * @param playerId The tracking_id of the player to set as captain
   */
  updateTeamCaptain: async (teamId: string, playerId: string): Promise<any> => {
    try {
      const uri = getUri(`/api/v1/fantasy-athletes/fantasy-team-athletes/update-captain`);

      // Validate that we have a playerId - a team must always have a captain
      if (!playerId) {
        throw new Error("Captain ID is required - a team must always have a captain");
      }

      console.log('Updating team captain:', { teamId, captainId: playerId });
      
      const response = await fetch(uri, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify({ 
          teamId, 
          captainId: playerId // This is the tracking_id from the frontend
        }),
      });

      if (!response.ok) {
        console.error("Failed to update team captain:", await response.text());
        throw new Error(
          `Failed to update captain: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating team captain:", error);
      throw error;
    }
  }
};
