/** Seasons Service */

import { IProAthlete } from '../types/athletes';
import { ISeasonRound } from '../types/fantasy/fantasySeason';
import { IFixture, ITeam } from '../types/games';
import { IProSeason, SeasonStandingsItem, TeamSeasonRecord } from '../types/season';
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

  getSeasonFixtures: async (seasonId: string, round?: number | string): Promise<IFixture[]> => {
    try {
      const queryParams = round ? `?round=${round}` : '';
      const uri = getUri(`/api/v1/seasons/${seasonId}/games${queryParams}`);
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


  getSeasonRounds: async (seasonId: string): Promise<ISeasonRound[]> => {
    
    try {
      const uri = getUri(`/api/v1/seasons/${seasonId}/rounds`);
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as ISeasonRound[];
      }
    } catch (err) {
      logger.error('Error fetching season rounds ', err);
    }

    return [];

  },

  /** Gets a team's season record */
  getTeamSeasonRecord: async (seasonId: string, teamId: string) : Promise<TeamSeasonRecord | undefined> => {
    try {
      
      const uri = getUri(`/api/v1/seasons/${seasonId}/teams/${teamId}/record`);
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as TeamSeasonRecord;
      }

    } catch (err) {
      logger.error("Error fetching team season record ", err);
    }

    return undefined;
  },


  getSeasonStandings: async (seasonId: string) : Promise<SeasonStandingsItem[]> => {
    try {
      const uri = getUri(`/api/v1/seasons/${seasonId}/standings`);
      
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as SeasonStandingsItem[];
      }

    } catch (err) {
      logger.error("Error fetching season standings ", err);
    }

    return [];
  }
};
