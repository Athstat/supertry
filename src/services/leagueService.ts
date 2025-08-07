import { IFantasyLeague, IFantasyLeagueTeam, ISeason } from '../types/fantasyLeague';
import { IGamesLeagueConfig } from '../types/leagueConfig';
import { getAuthHeader, getUri } from '../utils/backendUtils';
import { analytics } from './anayticsService';
import { fantasyTeamService } from './fantasyTeamService';
import { authService } from './authService';
import { ICreateFantasyTeamAthleteItem } from '../types/fantasyTeamAthlete';

export const leagueService = {
  getAllLeagues: async (): Promise<IFantasyLeague[]> => {
    try {
      const uri = getUri(`/api/v1/fantasy-leagues/`);
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        const json = await response.json();
        return json;
      } else {
        console.error('Failed to fetch leagues:', await response.text());
        throw new Error('Failed to fetch leagues');
      }
    } catch (error) {
      console.error('Error in leagueService:', error);
      return [];
    }
  },

  /**
   * Fetch a league by its ID
   */
  getLeagueById: async (leagueId: number): Promise<IFantasyLeague | undefined> => {
    try {
      if (leagueId == 0) return undefined;

      const uri = getUri(`/api/v1/fantasy-leagues/${leagueId}`);

      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch league by ID:', await response.text());
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching league by ID:', error);
      return undefined;
    }
  },

  /**
   * Fetch a league by its official league ID
   */
  getLeagueByOfficialId: async (officialLeagueId: string): Promise<IFantasyLeague | undefined> => {
    try {
      if (!officialLeagueId) return undefined;

      // First, get all leagues and find the one with matching official_league_id
      const allLeagues = await leagueService.getAllLeagues();
      const league = allLeagues.find(l => l.official_league_id === officialLeagueId);

      if (league) {
        return league;
      }

      // Fallback: try direct fetch by ID (in case officialLeagueId is actually the league ID)
      const uri = getUri(`/api/v1/fantasy-leagues/${officialLeagueId}`);

      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch league by official ID:', await response.text());
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching league by official ID:', error);
      return undefined;
    }
  },

  /**
   * Fetch participating teams for a league
   */
  fetchParticipatingTeams: async (leagueId: string | number): Promise<IFantasyLeagueTeam[]> => {
    try {
      const uri = getUri(`/api/v1/fantasy-leagues/${leagueId}/teams`);

      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        console.error('Failed to fetch participating teams:', await response.text());
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching participating teams:', error);
      return [];
    }
  },

  getLeagueConfig: async (officialLeagueId: string): Promise<IGamesLeagueConfig | null> => {
    try {
      const uri = getUri(`/api/v1/fantasy-leagues-config/${officialLeagueId}`);

      try {
        const response = await fetch(uri, {
          method: 'GET',
          headers: getAuthHeader(),
        });

        if (response.ok) {
          return await response.json();
        } else {
          console.error('Failed to fetch league config:', await response.text());
          throw new Error('Failed to fetch league config');
        }
      } catch (apiError) {
        console.error('API fetch error:', apiError);
        return null;
      }
    } catch (error) {
      console.error('Error in leagueService.getLeagueConfig:', error);
      return null;
    }
  },

  joinLeague: async (
    leagueId: string,
    userId: string,
    teamName: string,
    athletes: ICreateFantasyTeamAthleteItem[]
  ): Promise<any> => {
    try {
      const uri = getUri(`/api/v1/fantasy-leagues/${leagueId}/join`);
      const headers = getAuthHeader();

      const payload = {
        user_id: userId,
        team_name: teamName,
        athletes: athletes.map(athlete => ({
          athlete_id: athlete.athlete_id,
          purchase_price: athlete.purchase_price,
          is_starting: athlete.is_starting,
          slot: athlete.slot,
          is_captain: athlete.is_captain,
          is_super_sub: athlete.is_super_sub,
        })),
      };

      console.log('Joining league with new team:', { uri, payload });

      const response = await fetch(uri, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to join league:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`Failed to join league: ${response.statusText}`);
      }

      const responseData = await response.json();
      // Assuming responseData contains league and team info for analytics
      // analytics.trackTeamCreationCompleted(leagueId, responseData.team.id, responseData.league.official_league_id);
      return responseData;
    } catch (error) {
      console.error('Error in leagueService.joinLeague:', error);
      throw error;
    }
  },

  joinLeagueWithExistingTeam: async (league: any, teamId?: string): Promise<any> => {
    try {
      // Get user ID from auth service (Django uses simple tokens, not JWTs)
      const userInfo = await authService.getUserInfo();

      if (!userInfo || !userInfo.kc_id) {
        throw new Error('Could not determine user identity. Please log in again.');
      }

      const userId = userInfo.kc_id;

      let teamToJoin;

      if (teamId) {
        // If team ID is provided, use it directly
        teamToJoin = { id: teamId };
      } else {
        // Fallback: Fetch the user's latest team
        const userTeams = await fantasyTeamService.fetchUserTeams();

        if (!userTeams || userTeams.length === 0) {
          throw new Error('Could not find your team. Please try again.');
        }

        // Use the most recently created team (assuming it's the one we just submitted)
        teamToJoin = userTeams.reduce(
          (highest, team) => (team.id > highest.id ? team : highest),
          userTeams[0]
        );
      }

      const uri = getUri(`/api/v1/fantasy-leagues/join-league`);

      const headers = getAuthHeader();

      // Check if we have an auth token
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Ensure we're sending the correct structure expected by Django
      const payload = {
        team: {
          id: teamToJoin.id,
        },
        league: {
          id: league.id || league.league_id, // Handle both possible field names
        },
        user_id: userId,
      };

      console.log('Join league request:', {
        uri,
        headers,
        payload,
        hasToken: !!token,
        tokenPrefix: token ? token.substring(0, 10) + '...' : 'none',
      });

      const response = await fetch(uri, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to join league:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          headers: response.headers,
        });
        throw new Error(`Failed to join league: ${response.status} ${response.statusText}`);
      }

      analytics.trackTeamCreationCompleted(league.id, teamToJoin.id, league.official_league_id);

      return await response.json();
    } catch (error) {
      console.error('Error in leagueService.joinLeague:', error);
      throw error;
    }
  },

  /**
   * Check if the current user has joined a specific league
   * Used both methods and consolidated them into one
   */
  checkUserLeagueStatus: async (leagueId: string): Promise<boolean> => {
    try {
      // Try the first approach - look for user teams in the league
      try {
        const userTeams = await fantasyTeamService
          .fetchUserTeams
          // leagueId
          ();
        // If the user has any teams in this league, they've joined it
        if (userTeams.length > 0) {
          return true;
        }
      } catch (error) {
        console.log('First approach failed, trying second approach', error);
      }

      // Get user ID from auth service (Django uses simple tokens, not JWTs)
      const userInfo = await authService.getUserInfo();
      if (!userInfo || !userInfo.kc_id) return false;

      const userId = userInfo.kc_id;

      // Fetch participating teams for this league
      const participatingTeams = await leagueService.fetchParticipatingTeams(leagueId);

      // Check if any team belongs to the current user
      return participatingTeams.some(team => team.user_id === userId);
    } catch (error) {
      console.error(`Error checking user status for league ${leagueId}:`, error);
      return false;
    }
  },

  /**
   * Fetch all available competitions/seasons
   */
  getAllSeasons: async (): Promise<ISeason[]> => {
    try {
      const uri = getUri('/api/v1/seasons/');
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch seasons');
      }
    } catch (error) {
      console.error('Error in getAllSeasons:', error);
      return [];
    }
  },
};
