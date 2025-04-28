/**
 * API service for player-related data
 */

/**
 * Fetch detailed player statistics from Incrowd Sports API
 */
export const fetchPlayerDetails = async (
  incrowed_team_id: string,
  incrowed_competition_id: string,
  incrowed_season_id: string
) => {
  try {
    const response = await fetch(
      `https://rugby-union-feeds.incrowdsports.com/v1/teams/${incrowed_team_id}/players?provider=rugbyviz&competitionId=${incrowed_competition_id}&seasonId=${incrowed_season_id}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching player details:', error);
    throw error;
  }
};

/**
 * Find a specific player in the roster by name
 */
export const findPlayerInRoster = (roster: any[], playerName: string) => {
  if (!roster || !Array.isArray(roster)) return null;
  
  // Normalize player name for comparison
  const normalizedSearchName = playerName.toLowerCase().trim();
  
  // Find the matching player
  return roster.find(player => {
    const knownName = player.knownName?.toLowerCase().trim() || '';
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase().trim();
    
    return knownName === normalizedSearchName || fullName === normalizedSearchName;
  });
};
