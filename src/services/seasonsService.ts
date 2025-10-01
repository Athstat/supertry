/** Seasons Service */

import { IProAthlete } from '../types/athletes';
import { IFixture, ITeam } from '../types/games';
import { IProSeason } from '../types/season';
import { getAuthHeader, getUri } from '../utils/backendUtils';
import { logger } from './logger';

export const seasonService = {
  getAllSupportedSeasons: async (): Promise<IProSeason[]> => {
    try {
      const uri = getUri(`/api/v1/seasons`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProSeason[];
      }
    } catch (error) {
      logger.error('Error fetching season ', error);
    }

    return [];
  },

  getSeasonsById: async (seasonId: string): Promise<IProSeason | undefined> => {
    try {
      const uri = getUri(`/api/v1/seasons/${seasonId}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProSeason;
      }
    } catch (error) {
      logger.error('Error fetching season ', error);
    }

    return undefined;
  },

  getSeasonTeams: async (seasonId: string): Promise<ITeam[]> => {
    try {
      const uri = getUri(`/api/v1/seasons/${seasonId}/teams`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const arr = (await res.json()) as ITeam[];
        return arr.filter(t => t.athstat_name !== 'TBC');
      }
    } catch (error) {
      logger.error('Error fetching season ', error);
    }

    return [];
  },

  getSeasonFixtures: async (seasonId: string): Promise<IFixture[]> => {
    try {
      const uri = getUri(`/api/v1/seasons/${seasonId}/games`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IFixture[];
      }
    } catch (error) {
      logger.error('Error fetching season ', error);
    }

    return [];
  },

  getSeasonAthletes: async (seasonId: string): Promise<IProAthlete[]> => {
    try {
      console.log('running: ', seasonId);
      const uri = getUri(`/api/v1/seasons/${seasonId}/athletes?ordering=power_rank_rating`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProAthlete[];
      }
    } catch (error) {
      logger.error('Error fetching season ', error);
    }

    return [];
  },
};
