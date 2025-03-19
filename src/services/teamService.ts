import { Player } from "../types/player";
import {
  IFantasyTeamAthlete,
  IFantasyClubTeam,
} from "../types/fantasyTeamAthlete";

export const teamService = {
  /**
   * Submit a fantasy team to the server
   */
  submitTeam: async (
    teamName: string,
    players: Record<string, Player>,
    leagueId: string
  ): Promise<IFantasyClubTeam> => {
    try {
      // Always use the production URL for this endpoint since it's not available in local dev
      const baseUrl = "https://qa-games-app.athstat-next.com";

      // Get user ID from token (or use a default if not available)
      const token = localStorage.getItem("access_token");

      console.log("Token: ", token);

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

      // Convert players to IFantasyTeamAthlete format
      const teamAthletes: IFantasyTeamAthlete[] = Object.values(players).map(
        (player, index) => ({
          athlete_id: player.id,
          purchase_price: player.price || player.cost || 0,
          purchase_date: new Date(),
          is_starting: true, // All players are starting by default
          slot: index + 1, // Assign slots sequentially
          score: 0, // Initial score is 0
        })
      );

      // Prepare the request payload
      const payload = {
        clubId: 10, //need to update this
        leagueId: leagueId,
        name: teamName,
        team: teamAthletes,
      };

      console.log("Submitting team with payload:", payload);

      // Make the API request
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

      // Log response details for debugging
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries([...response.headers])
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
};
