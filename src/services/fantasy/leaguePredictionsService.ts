/** Service for league-specific prediction rankings */

import { LeaguePredictionRanking } from '../../types/fantasyLeagueGroups';
import { getAuthHeader, getUri } from '../../utils/backendUtils';
import { logger } from '../logger';

export const leaguePredictionsService = {
  /**
   * Get prediction rankings for a specific league
   * @param leagueId - The league ID
   * @param roundId - Optional round ID to filter by specific week ('overall' for all weeks)
   */
  getLeaguePredictionsRankings: async (
    leagueId: string,
    roundId?: string
  ): Promise<LeaguePredictionRanking[]> => {
    try {
      let uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/predictions/rankings`);

      // Add round_id as query parameter if provided and not 'overall'
      if (roundId && roundId !== 'overall') {
        uri += `?round_id=${roundId}`;
      }

      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as LeaguePredictionRanking[];
      }

      logger.error('Failed to fetch league predictions rankings', res.statusText);
      return [];
    } catch (error) {
      logger.error('Error fetching league predictions rankings', error);
      return [];
    }
  },

  /**
   * Get prediction history for a specific user in a league
   * @param leagueId - The league ID
   * @param userId - The user ID
   * @param roundId - Optional round ID to filter by specific week
   */
  getUserPredictionsHistory: async (
    leagueId: string,
    userId: string,
    roundId?: string
  ): Promise<any[]> => {
    try {
      let uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/predictions/history/${userId}`);

      // Add round_id as query parameter if provided and not 'overall'
      if (roundId && roundId !== 'overall') {
        uri += `?round_id=${roundId}`;
      }

      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return await res.json();
      }

      logger.error('Failed to fetch user predictions history', res.statusText);
      return [];
    } catch (error) {
      logger.error('Error fetching user predictions history', error);
      return [];
    }
  },
};
