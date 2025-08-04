import { getAuthHeader, getUri } from '../utils/backendUtils';
import { ICreateFantasyLeague, IUserCreatedLeague } from '../types/userCreatedLeague';

export const userCreatedLeagueService = {
  /**
   * Create a new fantasy league
   */
  createFantasyLeague: async (leagueData: ICreateFantasyLeague): Promise<IUserCreatedLeague> => {
    if (!leagueData.season_id) throw new Error('Competition/season is required');
    try {
      const uri = getUri('/api/v1/fantasy-leagues/create/');
      const response = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(leagueData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('Failed to create fantasy league:', errorText);
        throw new Error(`Failed to create fantasy league: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in createFantasyLeague:', error);
      throw error;
    }
  },

  /**
   * Get leagues created by the current user
   */
  getUserCreatedLeagues: async (): Promise<IUserCreatedLeague[]> => {
    try {
      const uri = getUri('/api/v1/fantasy-leagues/user-created/');
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch user created leagues:', await response.text());
        throw new Error('Failed to fetch user created leagues');
      }
    } catch (error) {
      console.error('Error in getUserCreatedLeagues:', error);
      return [];
    }
  },

  /**
   * Get public leagues created by other users
   */
  getPublicLeagues: async (): Promise<IUserCreatedLeague[]> => {
    try {
      const uri = getUri('/api/v1/fantasy-leagues/public/');
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch public leagues:', await response.text());
        throw new Error('Failed to fetch public leagues');
      }
    } catch (error) {
      console.error('Error in getPublicLeagues:', error);
      return [];
    }
  },
};
