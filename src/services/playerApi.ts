/**
 * API service for player-related data
 */

// Map of action names to human-friendly labels
const actionLabels: Record<string, string> = {
  Assists: 'Assists',
  Carries: 'Carries',
  CarriesMadeGainLine: 'Gain Line Carries',
  DefendersBeaten: 'Defenders Beaten',
  LineBreaks: 'Line Breaks',
  LineoutsWon: 'Lineouts Won',
  LineoutsWonSteal: 'Lineouts Stolen',
  Metres: 'Meters Gained',
  MinutesPlayed: 'Minutes Played',
  Offloads: 'Offloads',
  Passes: 'Passes',
  PenaltiesConceded: 'Penalties Conceded',
  Points: 'Points Scored',
  TacklesMade: 'Tackles Made',
  TacklesMissed: 'Tackles Missed',
  TackleSuccess: 'Tackle Success %',
  Tries: 'Tries',
  TurnoversConceded: 'Turnovers Conceded',
  TurnoversWon: 'Turnovers Won',
  Starts: 'Starts'
};

// Categories for grouping stats in the UI
const statCategories = {
  attack: ['Carries', 'CarriesMadeGainLine', 'Metres', 'LineBreaks', 'DefendersBeaten', 'Offloads', 'Passes', 'Assists'],
  defense: ['TacklesMade', 'TacklesMissed', 'TackleSuccess', 'TurnoversWon'],
  general: ['Tries', 'Points', 'MinutesPlayed', 'Starts'],
  discipline: ['PenaltiesConceded', 'TurnoversConceded'],
  setpiece: ['LineoutsWon', 'LineoutsWonSteal']
};

/**
 * Fetch detailed player statistics from our API
 */
export const fetchPlayerStats = async (athleteId: string) => {
  console.log('Fetching stats for athlete ID:', athleteId);
  
  try {
    // Try to get token from localStorage
    const token = localStorage.getItem('access_token');
    console.log('Token available:', !!token);
    
    // For development/testing, use a hardcoded API response if no token
    if (!token) {
      console.warn('No auth token found, using mock data');
      return getMockPlayerStats();
    }
    
    const url = `https://qa-games-app.athstat-next.com/api/v1/sports-actions/aggregated/athletes/${athleteId}`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      console.error('API error response:', response);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    return processStatsData(data);
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    // Fall back to mock data in case of any error
    console.warn('Falling back to mock data due to error');
    return getMockPlayerStats();
  }
};

/**
 * Generate mock player stats for development/testing
 */
const getMockPlayerStats = () => {
  console.log('Generating mock stats data');
  
  // Sample mock data mimicking API response format
  const mockRawStats = [
    { id: "mock_TacklesMade", athlete_id: "mock", action: "TacklesMade", action_count: 118 },
    { id: "mock_TackleSuccess", athlete_id: "mock", action: "TackleSuccess", action_count: 85.5 },
    { id: "mock_Assists", athlete_id: "mock", action: "Assists", action_count: 12 },
    { id: "mock_Starts", athlete_id: "mock", action: "Starts", action_count: 15 },
    { id: "mock_CarriesMadeGainLine", athlete_id: "mock", action: "CarriesMadeGainLine", action_count: 42 },
    { id: "mock_TurnoversConceded", athlete_id: "mock", action: "TurnoversConceded", action_count: 7 },
    { id: "mock_TurnoversWon", athlete_id: "mock", action: "TurnoversWon", action_count: 5 },
    { id: "mock_LineoutsWon", athlete_id: "mock", action: "LineoutsWon", action_count: 25 },
    { id: "mock_Points", athlete_id: "mock", action: "Points", action_count: 24 },
    { id: "mock_Tries", athlete_id: "mock", action: "Tries", action_count: 4 },
    { id: "mock_Carries", athlete_id: "mock", action: "Carries", action_count: 81 },
    { id: "mock_LineBreaks", athlete_id: "mock", action: "LineBreaks", action_count: 8 },
    { id: "mock_DefendersBeaten", athlete_id: "mock", action: "DefendersBeaten", action_count: 14 },
    { id: "mock_Metres", athlete_id: "mock", action: "Metres", action_count: 342 },
    { id: "mock_MinutesPlayed", athlete_id: "mock", action: "MinutesPlayed", action_count: 738 },
    { id: "mock_TacklesMissed", athlete_id: "mock", action: "TacklesMissed", action_count: 12 },
    { id: "mock_Offloads", athlete_id: "mock", action: "Offloads", action_count: 9 },
    { id: "mock_Passes", athlete_id: "mock", action: "Passes", action_count: 127 },
    { id: "mock_PenaltiesConceded", athlete_id: "mock", action: "PenaltiesConceded", action_count: 6 }
  ];
  
  return processStatsData(mockRawStats);
};

/**
 * Process the raw stats data into a more usable format
 */
const processStatsData = (rawStats: any[]) => {
  // Convert array of actions to an object with action as key
  const statsMap: Record<string, number> = {};
  
  rawStats.forEach(stat => {
    statsMap[stat.action] = stat.action_count;
  });
  
  // Create categorized stats for UI display
  const categorizedStats = {
    attack: extractCategoryStats(statsMap, statCategories.attack),
    defense: extractCategoryStats(statsMap, statCategories.defense),
    general: extractCategoryStats(statsMap, statCategories.general),
    discipline: extractCategoryStats(statsMap, statCategories.discipline),
    setpiece: extractCategoryStats(statsMap, statCategories.setpiece)
  };
  
  // Calculate derived metrics
  if (statsMap.TacklesMade && statsMap.TacklesMissed) {
    const totalTackles = statsMap.TacklesMade + statsMap.TacklesMissed;
    statsMap.TackleSuccess = totalTackles > 0 ? statsMap.TacklesMade / totalTackles * 100 : 0;
  }
  
  return {
    rawStats,
    statsMap,
    categorizedStats
  };
};

/**
 * Extract stats for a specific category
 */
const extractCategoryStats = (statsMap: Record<string, number>, categoryActions: string[]) => {
  return categoryActions.reduce((result, action) => {
    if (statsMap[action] !== undefined) {
      result.push({
        action,
        label: actionLabels[action] || formatActionName(action),
        value: statsMap[action],
        // Format percentage values differently
        displayValue: action === 'TackleSuccess' 
          ? `${Math.round(statsMap[action])}%`
          : statsMap[action].toString()
      });
    }
    return result;
  }, [] as Array<{action: string, label: string, value: number, displayValue: string}>);
};

/**
 * Format an action name into a human-readable label if not in the mapping
 */
const formatActionName = (action: string): string => {
  if (actionLabels[action]) return actionLabels[action];
  
  // Convert camelCase to separate words with spaces
  return action
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};
