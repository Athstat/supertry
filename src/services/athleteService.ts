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

// Define the type for power ranking item
export interface PowerRankingItem {
  athlete_id: string;
  game_id: string;
  updated_power_ranking: number;
  team_name: string;
  opposition_name: string;
  kickoff_time: string;
}

const baseUrl = "https://qa-games-app.athstat-next.com";

// Map of action names to human-friendly labels for player stats
export const actionLabels: Record<string, string> = {
  Assists: "Assists",
  Carries: "Carries",
  CarriesMadeGainLine: "Gain Line Carries",
  DefendersBeaten: "Defenders Beaten",
  LineBreaks: "Line Breaks",
  LineoutsWon: "Lineouts Won",
  LineoutsWonSteal: "Lineouts Stolen",
  Metres: "Meters Gained",
  MinutesPlayed: "Minutes Played",
  Offloads: "Offloads",
  Passes: "Passes",
  PenaltiesConceded: "Penalties Conceded",
  Points: "Points Scored",
  TacklesMade: "Tackles Made",
  TacklesMissed: "Tackles Missed",
  TackleSuccess: "Tackle Success %",
  Tries: "Tries",
  TurnoversConceded: "Turnovers Conceded",
  TurnoversWon: "Turnovers Won",
  Starts: "Starts",
};

// Categories for grouping stats in the UI
export const statCategories = {
  attack: [
    "Carries",
    "CarriesMadeGainLine",
    "Metres",
    "LineBreaks",
    "DefendersBeaten",
    "Offloads",
    "Passes",
    "Assists",
  ],
  defense: ["TacklesMade", "TacklesMissed", "TackleSuccess", "TurnoversWon"],
  general: ["Tries", "Points", "MinutesPlayed", "Starts"],
  discipline: ["PenaltiesConceded", "TurnoversConceded"],
  setpiece: ["LineoutsWon", "LineoutsWonSteal"],
};

export const athleteService = {
  // Get all rugby athletes by competition
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

  // Get detailed player statistics by athlete ID
  getAthleteStats: async (athleteId: string) => {
    console.log("Fetching stats for athlete ID:", athleteId);

    try {
      // Try to get token from localStorage
      const access_token = localStorage.getItem("access_token");
      console.log("Token available:", !!access_token);

      // For development/testing, use a hardcoded API response if no token
      if (!access_token) {
        console.warn("No auth token found, using mock data");
        return getMockPlayerStats();
      }

      const url = `${baseUrl}/api/v1/sports-actions/aggregated/athletes/${athleteId}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        console.error("API error response:", response);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response data:", data);
      return processStatsData(data);
    } catch (error) {
      console.error("Error fetching player statistics:", error);
      // Fall back to mock data in case of any error
      console.warn("Falling back to mock data due to error");
      return getMockPlayerStats();
    }
  },

  // Get player power rankings history
  getAthletePowerRankings: async (
    athleteId: string
  ): Promise<PowerRankingItem[]> => {
    console.log("Fetching power rankings for athlete ID:", athleteId);

    try {
      const url = `${baseUrl}/api/v1/unauth/athletes-power-rankings/${athleteId}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        console.error("API error response:", response);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Power Rankings data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching player power rankings:", error);
      // Return mock data in case of any error
      return getMockPowerRankings();
    }
  },
};

/**
 * Generate mock player stats for development/testing
 */
const getMockPlayerStats = () => {
  console.log("Generating mock stats data");

  // Sample mock data mimicking API response format
  const mockRawStats = [
    {
      id: "mock_TacklesMade",
      athlete_id: "mock",
      action: "TacklesMade",
      action_count: 118,
    },
    {
      id: "mock_TackleSuccess",
      athlete_id: "mock",
      action: "TackleSuccess",
      action_count: 85.5,
    },
    {
      id: "mock_Assists",
      athlete_id: "mock",
      action: "Assists",
      action_count: 12,
    },
    {
      id: "mock_Starts",
      athlete_id: "mock",
      action: "Starts",
      action_count: 15,
    },
    {
      id: "mock_CarriesMadeGainLine",
      athlete_id: "mock",
      action: "CarriesMadeGainLine",
      action_count: 42,
    },
    {
      id: "mock_TurnoversConceded",
      athlete_id: "mock",
      action: "TurnoversConceded",
      action_count: 7,
    },
    {
      id: "mock_TurnoversWon",
      athlete_id: "mock",
      action: "TurnoversWon",
      action_count: 5,
    },
    {
      id: "mock_LineoutsWon",
      athlete_id: "mock",
      action: "LineoutsWon",
      action_count: 25,
    },
    {
      id: "mock_Points",
      athlete_id: "mock",
      action: "Points",
      action_count: 24,
    },
    { id: "mock_Tries", athlete_id: "mock", action: "Tries", action_count: 4 },
    {
      id: "mock_Carries",
      athlete_id: "mock",
      action: "Carries",
      action_count: 81,
    },
    {
      id: "mock_LineBreaks",
      athlete_id: "mock",
      action: "LineBreaks",
      action_count: 8,
    },
    {
      id: "mock_DefendersBeaten",
      athlete_id: "mock",
      action: "DefendersBeaten",
      action_count: 14,
    },
    {
      id: "mock_Metres",
      athlete_id: "mock",
      action: "Metres",
      action_count: 342,
    },
    {
      id: "mock_MinutesPlayed",
      athlete_id: "mock",
      action: "MinutesPlayed",
      action_count: 738,
    },
    {
      id: "mock_TacklesMissed",
      athlete_id: "mock",
      action: "TacklesMissed",
      action_count: 12,
    },
    {
      id: "mock_Offloads",
      athlete_id: "mock",
      action: "Offloads",
      action_count: 9,
    },
    {
      id: "mock_Passes",
      athlete_id: "mock",
      action: "Passes",
      action_count: 127,
    },
    {
      id: "mock_PenaltiesConceded",
      athlete_id: "mock",
      action: "PenaltiesConceded",
      action_count: 6,
    },
  ];

  return processStatsData(mockRawStats);
};

/**
 * Generate mock power rankings for development/testing
 */
const getMockPowerRankings = (): PowerRankingItem[] => {
  console.log("Generating mock power rankings data");

  // Sample mock data mimicking API response format
  return [
    {
      athlete_id: "mock-id",
      game_id: "3bfe942e-179e-55df-b72e-ee674d4afcda",
      updated_power_ranking: 88,
      team_name: "Connacht Rugby",
      opposition_name: "Munster Rugby",
      kickoff_time: "2025-03-29T14:30:00.000Z",
    },
    {
      athlete_id: "mock-id",
      game_id: "80b4f49b-2ac4-57e7-a12e-9dc7c29b8db4",
      updated_power_ranking: 76,
      team_name: "Connacht Rugby",
      opposition_name: "Vodacom Bulls",
      kickoff_time: "2024-11-30T17:30:00.000Z",
    },
    {
      athlete_id: "mock-id",
      game_id: "e65594ee-f7e9-5191-9615-7fe22df36fd1",
      updated_power_ranking: 81,
      team_name: "Leinster Rugby",
      opposition_name: "Connacht Rugby",
      kickoff_time: "2024-12-21T17:30:00.000Z",
    },
    {
      athlete_id: "mock-id",
      game_id: "ec52bfc9-8120-5f76-902d-e92c04bc9522",
      updated_power_ranking: 82,
      team_name: "Glasgow Warriors",
      opposition_name: "Connacht Rugby",
      kickoff_time: "2025-01-26T15:30:00.000Z",
    },
    {
      athlete_id: "mock-id",
      game_id: "fd82c96a-9eb2-53fa-a655-ba5fde8323d9",
      updated_power_ranking: 92,
      team_name: "Connacht Rugby",
      opposition_name: "Cardiff Rugby",
      kickoff_time: "2025-04-05T19:00:00.000Z",
    },
    {
      athlete_id: "mock-id",
      game_id: "ad329bd8-3d2c-56d7-91b3-7a9311b59791",
      updated_power_ranking: 90,
      team_name: "Connacht Rugby",
      opposition_name: "Racing 92",
      kickoff_time: "2025-04-12T19:00:00.000Z",
    },
  ];
};

/**
 * Process the raw stats data into a more usable format
 */
const processStatsData = (rawStats: any[]) => {
  // Convert array of actions to an object with action as key
  const statsMap: Record<string, number> = {};

  rawStats.forEach((stat) => {
    statsMap[stat.action] = stat.action_count;
  });

  // Create categorized stats for UI display
  const categorizedStats = {
    attack: extractCategoryStats(statsMap, statCategories.attack),
    defense: extractCategoryStats(statsMap, statCategories.defense),
    general: extractCategoryStats(statsMap, statCategories.general),
    discipline: extractCategoryStats(statsMap, statCategories.discipline),
    setpiece: extractCategoryStats(statsMap, statCategories.setpiece),
  };

  // Calculate derived metrics
  if (statsMap.TacklesMade && statsMap.TacklesMissed) {
    const totalTackles = statsMap.TacklesMade + statsMap.TacklesMissed;
    statsMap.TackleSuccess =
      totalTackles > 0 ? (statsMap.TacklesMade / totalTackles) * 100 : 0;
  }

  return {
    rawStats,
    statsMap,
    categorizedStats,
  };
};

/**
 * Extract stats for a specific category
 */
const extractCategoryStats = (
  statsMap: Record<string, number>,
  categoryActions: string[]
) => {
  return categoryActions.reduce((result, action) => {
    if (statsMap[action] !== undefined) {
      result.push({
        action,
        label: actionLabels[action] || formatActionName(action),
        value: statsMap[action],
        // Format percentage values differently
        displayValue:
          action === "TackleSuccess"
            ? `${Math.round(statsMap[action])}%`
            : statsMap[action].toString(),
      });
    }
    return result;
  }, [] as Array<{ action: string; label: string; value: number; displayValue: string }>);
};

/**
 * Format an action name into a human-readable label if not in the mapping
 */
const formatActionName = (action: string): string => {
  if (actionLabels[action]) return actionLabels[action];

  // Convert camelCase to separate words with spaces
  return action
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
