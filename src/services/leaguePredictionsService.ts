import { UserPredictionsRanking } from '../types/sbr';

// Mock user ranking data
const mockUserRanking: UserPredictionsRanking = {
  kc_id: '1',
  first_name: 'Current',
  email: 'user@example.com',
  predictions_made: '18',
  correct_predictions: '12',
  wrong_predictions: '6',
  predictions_perc: 0.67,
  user_rank: '4',
};

// Mock leaderboard data
const mockLeaderboard = [
  {
    kc_id: '2',
    first_name: 'John',
    email: 'john@example.com',
    predictions_made: '24',
    correct_predictions: '18',
    wrong_predictions: '6',
    predictions_perc: 0.75,
    user_rank: '1',
  },
  {
    kc_id: '3',
    first_name: 'Jane',
    email: 'jane@example.com',
    predictions_made: '24',
    correct_predictions: '16',
    wrong_predictions: '8',
    predictions_perc: 0.67,
    user_rank: '2',
  },
  // Add more mock users as needed
];

export const leaguePredictionsService = {
  getLeagueUserPredictionsRanking: async (
    userId: string,
    leagueId?: string
  ): Promise<UserPredictionsRanking> => {
    // In a real implementation, this would make an API call
    // For now, just return mock data after a small delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockUserRanking);
      }, 500);
    });
  },

  getLeaguePredictionsLeaderboard: async (leagueId: string) => {
    // In a real implementation, this would make an API call
    // For now, just return mock data after a small delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockLeaderboard);
      }, 500);
    });
  },

  // For the future: add functions to submit predictions, get specific fixture predictions, etc.
  submitFixturePrediction: async (fixtureId: string, prediction: 'home' | 'away') => {
    // Mock implementation - would normally send API request
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
};
