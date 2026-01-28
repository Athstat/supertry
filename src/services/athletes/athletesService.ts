import { IProAthlete, IAthleteSeasonStarRatings, AthleteRoundAvailabilityReport, PlayerPriceHistoryItem } from '../../types/athletes';
import { IFixture } from '../../types/fixtures';
import { IProSeason } from '../../types/season';
import { SportAction } from '../../types/sports_actions';
import { getUri, getAuthHeader } from '../../utils/backendUtils';
import { mapSportsActionToAthstatName } from '../../utils/sportsActionUtils';
import { logger } from '../logger';

/** Pro Athlete Service for django API */
export const athleteService = {
  getAthleteById: async (id: string): Promise<IProAthlete | undefined> => {
    try {
      const uri = getUri(`/api/v1/athletes/${id}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProAthlete;
      }
    } catch (err) {
      logger.error('Error fetching athletes ', err);
    }

    return undefined;
  },

  getAllAthletes: async (): Promise<IProAthlete[]> => {
    try {
      const uri = getUri('/api/v1/athletes/');
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProAthlete[];
      }
    } catch (err) {
      logger.error('Error fetching athletes ', err);
    }

    return [];
  },

  getAthleteSportsActions: async (athleteId: string): Promise<SportAction[]> => {
    try {
      console.log('Fetching athlete sports aggregating actions ', athleteId);

      const uri = getUri(`/api/v1/athletes/${athleteId}/aggregated-stats`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const actions = (await res.json()) as SportAction[];
        const fixedActions: SportAction[] = actions.map(a => {
          return {
            action: mapSportsActionToAthstatName(a.action),
            athlete_id: a.athlete_id,
            action_count: a.action_count,
            season_id: a.season_id,
            season: a.season,
            definition: a.definition,
          };
        });

        return fixedActions;
      }
    } catch (error) {
      logger.error('Error fetching sports actions for ', athleteId, error);
    }

    return [];
  },

  getAthleteSeasonStarRatings: async (
    athleteId: string,
    seasonId: string
  ): Promise<IAthleteSeasonStarRatings | undefined> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/stars/season/${seasonId}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IAthleteSeasonStarRatings;
      }
    } catch (e) {
      logger.error('Error getting athlete star ratings ', e);
    }

    return undefined;
  },

  getAthleteCareerStarRatings: async (athleteId: string): Promise<IAthleteSeasonStarRatings[]> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/stars`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IAthleteSeasonStarRatings[];
      }
    } catch (e) {
      logger.error('Error getting athlete star ratings ', e);
    }

    return [];
  },

  getAthleteSeasons: async (athleteId: string): Promise<IProSeason[]> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/seasons`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProSeason[];
      }
    } catch (err) {
      logger.error('Error fetching athlete seasons ', err);
    }

    return [];
  },

  getAthleteSeasonStats: async (athleteId: string, season_id: string): Promise<SportAction[]> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/seasons/${season_id}/stats`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as SportAction[];
      }
    } catch (err) {
      console.log(`Error fetching athlete season stats for ${season_id} `, err);
    }

    return [];
  },

  getAthleteSeasonStaarRatings: async (
    athleteId: string,
    season_id: string
  ): Promise<IAthleteSeasonStarRatings | undefined> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/seasons/${season_id}/stars`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IAthleteSeasonStarRatings;
      }
    } catch (err) {
      console.log(`Error fetching athlete season stats for ${season_id} `, err);
    }

    return undefined;
  },

  getAthleteTeamMates: async (athleteId: string, limit?: number): Promise<IProAthlete[]> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/team-mates?limit=${limit ?? 10}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as IProAthlete[];
      }
    } catch (err) {
      console.log(`Error fetching athlete team mates for ${athleteId} `, err);
    }

    return [];
  },

  getAthleteMatchStats: async (athleteId: string, gameId: string): Promise<SportAction[]> => {
    try {
      const uri = getUri(`/api/v1/fixture/match-prs/athletes/${athleteId}/matches/${gameId}/stats`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      if (res.ok) {
        return (await res.json()) as SportAction[];
      }
    } catch (err) {
      console.log(`Error fetching athlete match stats for ${athleteId} in game ${gameId}`, err);
    }

    return [];
  },

  /** Gets a list of availability reports for season rounds that a player is eligible for */
  getAthleteAvailabilityReport: async (athleteId: string, specific_team_id?: string): Promise<AthleteRoundAvailabilityReport[]> => {

    try {
      const params = specific_team_id ? `?specific_team_id=${specific_team_id}` : ''
      const uri = getUri(`/api/v1/athletes/${athleteId}/availability${params}`);
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as AthleteRoundAvailabilityReport[];
      }
    } catch (err) {
      logger.error("Error fetching player availability report ", err);
    }

    return [];

  },

  getRoundAvailabilityReport: async (athleteId: string, seasonId: string, roundNumber: number, specific_team_id?: string): Promise<AthleteRoundAvailabilityReport | undefined> => {

    try {
      const params = specific_team_id ? `?specific_team_id=${specific_team_id}` : ''
      const uri = getUri(`/api/v1/athletes/${athleteId}/availability/by-season/${seasonId}/${roundNumber}${params}`);
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as AthleteRoundAvailabilityReport;
      }
    } catch (err) {
      logger.error("Error fetching player availability report ", err);
    }

    return undefined;

  },

  getPriceHistory: async (athleteId: string, limit: number = 10) : Promise<PlayerPriceHistoryItem[]> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/price-history?limit=${limit}`);
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as PlayerPriceHistoryItem[]
      }
    } catch (err) {
      logger.error("Error fetching price history ", err);
    }

    return [];
  },

  getNextNMatches: async (athleteId: string, limit: number = 1) : Promise<IFixture[]> => {
    try {
      const uri = getUri(`/api/v1/athletes/${athleteId}/next-matches?limit=${limit}`);
      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        return (await res.json()) as IFixture[];
      }
    } catch (err) {
      logger.error("Error fetching next match ", err);
    }

    return [];
  }
};
