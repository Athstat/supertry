import { IFixture, IFullFixture, IGameVote, IRosterItem, ITeamAction } from '../types/games';
import { getAuthHeader, getUri } from '../utils/backendUtils';
import { logger } from './logger';
import { authService } from './authService';

/** Games Service */
export const gamesService = {
  getUpcomingGamesByCompetitionId: async (competitionId: string): Promise<IFixture[]> => {
    const uri = getUri(`/api/v1/entities/games-upcoming/${competitionId}`);

    try {
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      return (await res.json()) as IFixture[];
    } catch (err) {
      console.log('Error fetching games', err);
      return [];
    }
  },

  getGamesByCompetitionId: async (competitionId: string): Promise<IFixture[]> => {
    //const uri = getUri(`/api/v1/games/leagues/${competitionId}`); //no such endpoint
    const uri = getUri(`/api/v1/games/`);

    try {
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      return (await res.json()) as IFixture[];
    } catch (err) {
      console.log('Error fetching games', err);
      return [];
    }
  },

  getGamesByLeagueId: async (leagueId: string): Promise<IFixture[]> => {
    const uri = getUri(`/api/v1/fantasy-leagues/${leagueId}/related-games`);

    try {
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      return (await res.json()) as IFixture[];
    } catch (err) {
      console.log('Error fetching games', err);
      return [];
    }
  },

  getGameById: async (gameId: string): Promise<IFullFixture | undefined> => {
    const uri = getUri(`/api/v1/games/${gameId}`);

    try {
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IFixture;
      }

      
    } catch (err) {
      console.log('Error fetching games', err);
      return undefined;
    }
  },

  getGamesByDate: async (date: Date) => {
    try {
      const uri = getUri(`/api/v1/unauth/matches-all/${date.toISOString()}`);
      const res = await fetch(uri);

      const json = (await res.json()) as IFixture[];

      return json;
    } catch (error) {
      logger.error('Error getting games ' + error);
      return [];
    }
  },

  /** Gets roster items for a single game */
  getGameRostersById: async (gameId: string): Promise<IRosterItem[]> => {
    try {
      const uri = getUri(`/api/v1/games/${gameId}/rosters`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      const json = await res.json();
      return json;
    } catch (error) {
      logger.error('Failed to get game rosters ' + error);
      return [];
    }
  },

  // Voting methods
  getGameVotes: async (gameId: string): Promise<IGameVote[]> => {
    try {
      const uri = getUri(`/api/v1/games/${gameId}/votes`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      const json = await res.json();
      return json;
    } catch (error) {
      logger.error(error);
      return [];
    }
  },

  postGameVote: async (gameId: string, voteFor: 'home_team' | 'away_team') => {
    try {
      const user = await authService.getUserInfo();
      if (!user) return;
      const uri = getUri(`/api/v1/games/${gameId}/votes`);

      console.log('user: ', user);

      const res = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ vote_for: voteFor, user_id: user.kc_id }),
      });

      return await res.json();
    } catch (error) {
      logger.error(error);
    }
  },

  putGameVote: async (gameId: string, voteFor: 'home_team' | 'away_team') => {
    try {
      const user = await authService.getUserInfo();
      if (!user) return;
      const uri = getUri(`/api/v1/games/${gameId}/votes/${user.kc_id}`);

      const res = await fetch(uri, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ vote_for: voteFor }),
      });

      return await res.json();
    } catch (error) {
      logger.error(error);
    }
  },

  getGameTeamActions: async (gameId: string): Promise<ITeamAction[]> => {
    try {
      const uri = getUri(`/api/v1/games/${gameId}/team-actions`);

      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as ITeamAction[];
      }
    } catch (err) {
      logger.error('Error loading team actions ', err);
    }

    return [];
  },

  getAllSupportedGames: async (): Promise<IFixture[]> => {
    const uri = getUri(`/api/v1/games/`);

    try {
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      return (await res.json()) as IFixture[];
    } catch (err) {
      console.log('Error fetching games', err);
      return [];
    }
  },
};
