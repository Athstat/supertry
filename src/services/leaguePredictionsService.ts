import { api } from './api';
import { UserPredictionsRanking } from '../types/sbr';

/**
 * Service for fetching league predictions data
 */
class LeaguePredictionsService {
  /**
   * Get the current user's prediction rankings for a specific league
   */
  async getLeagueUserPredictionsRanking(
    userId: string,
    leagueId?: string
  ): Promise<UserPredictionsRanking> {
    if (!leagueId) throw new Error('League ID is required');

    const response = await api.get(`/league/${leagueId}/predictions/user/${userId}/ranking`);
    return response.data;
  }

  /**
   * Get the predictions leaderboard for a specific league
   */
  async getLeaguePredictionsLeaderboard(leagueId: string): Promise<UserPredictionsRanking[]> {
    const response = await api.get(`/league/${leagueId}/predictions/leaderboard`);
    return response.data;
  }
}

export const leaguePredictionsService = new LeaguePredictionsService();
