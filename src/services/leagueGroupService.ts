import { getAuthHeader, getUri } from '../utils/backendUtils';
import {
  IUserLeagueGroup,
  ICreateLeagueGroup,
  ILeagueGroupMember,
  IJoinLeagueGroup,
  ILeagueGroupJoinError,
} from '../types/leagueGroup';

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

  /**
   * Generate a shareable invite link
   */
  generateInviteLink: (inviteCode: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/join-group/${inviteCode}`;
  },

  /**
   * Generate invite message for sharing
   */
  generateInviteMessage: (groupName: string, inviteCode: string): string => {
    const inviteLink = leagueGroupService.generateInviteLink(inviteCode);
    return `Join my league group "${groupName}" on Scrummy! Use code: ${inviteCode} or click: ${inviteLink}`;
  },

  /**
   * Share via native sharing (if available)
   */
  shareInvite: async (groupName: string, inviteCode: string): Promise<void> => {
    const message = leagueGroupService.generateInviteMessage(groupName, inviteCode);

    // Check if native sharing is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${groupName} on Scrummy`,
          text: message,
          url: leagueGroupService.generateInviteLink(inviteCode),
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Sharing cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(message);
      // You might want to show a toast notification here
    }
  },
};
