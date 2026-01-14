import { getAuthHeader, getUri } from '../utils/backendUtils';
import {
  IUserLeagueGroup,
  ICreateLeagueGroup,
  ILeagueGroupMember,
  IJoinLeagueGroup,
  ILeagueGroupJoinError,
} from '../types/leagueGroup';
import { FantasyLeagueGroup } from '../types/fantasyLeagueGroups';

export const leagueGroupService = {
  /**
   * Get all league groups for the current user
   */
  getUserLeagueGroups: async (): Promise<IUserLeagueGroup[]> => {
    try {
      const uri = getUri('/api/v1/league-groups/');
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch league groups:', await response.text());
        throw new Error('Failed to fetch league groups');
      }
    } catch (error) {
      console.error('Error in getUserLeagueGroups:', error);
      return [];
    }
  },

  /**
   * Create a new league group
   */
  createLeagueGroup: async (groupData: ICreateLeagueGroup): Promise<IUserLeagueGroup> => {
    try {
      const uri = getUri('/api/v1/league-groups/');
      const response = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.error('Failed to create league group:', errorText);
        throw new Error(`Failed to create league group: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in createLeagueGroup:', error);
      throw error;
    }
  },

  /**
   * Get league group details by ID or invite code
   */
  getLeagueGroup: async (identifier: string): Promise<IUserLeagueGroup> => {
    try {
      const uri = getUri(`/api/v1/league-groups/${identifier}/`);
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch league group:', await response.text());
        throw new Error(`Failed to fetch league group: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in getLeagueGroup:', error);
      throw error;
    }
  },

  /**
   * Join a league group via invite code
   */
  joinLeagueGroup: async (joinData: IJoinLeagueGroup): Promise<IUserLeagueGroup> => {
    try {
      const uri = getUri('/api/v1/league-groups/join/');
      const response = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(joinData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        // Handle specific error case where user needs to join fantasy league first
        if (response.status === 400 && errorData.fantasy_league_id) {
          const errorInfo: ILeagueGroupJoinError = errorData;
          throw new Error(JSON.stringify(errorInfo));
        }
        throw new Error(`Failed to join league group: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in joinLeagueGroup:', error);
      throw error;
    }
  },

  /**
   * Get members of a league group
   */
  getLeagueGroupMembers: async (groupId: string): Promise<ILeagueGroupMember[]> => {
    try {
      const uri = getUri(`/api/v1/league-groups/${groupId}/members/`);
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch league group members:', await response.text());
        throw new Error(`Failed to fetch league group members: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in getLeagueGroupMembers:', error);
      return [];
    }
  },

  /**
   * Promote a member to admin (creator only)
   */
  promoteToAdmin: async (groupId: string, userId: string): Promise<{ message: string }> => {
    try {
      const uri = getUri(`/api/v1/league-groups/${groupId}/members/${userId}/promote/`);
      const response = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({}),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to promote member:', await response.text());
        throw new Error(`Failed to promote member: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in promoteToAdmin:', error);
      throw error;
    }
  },

  /** Returns all the leagues the user has joined */
  getUserJoinedLeagueGroups: async (): Promise<FantasyLeagueGroup[]> => {
    try {
      
      const uri = getUri('/api/v1/league-groups/joined');
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('Error in getUserLeagueGroups:', error);
    }
    
    return [];

  },
};
