import { SingleMatchPowerRanking } from '../types/powerRankings';
import { getAuthHeader, getUri } from '../utils/backendUtils';
import { logger } from './logger';

export const powerRankingsService = {
  getPastMatchsPowerRankings: async (athleteId: string, limit?: number, seasonId?: string) => {
    try {
      const queryParams = [];
      if (limit) queryParams.push(`limit=${limit}`);
      if (seasonId) queryParams.push(`season_id=${seasonId}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const uri = getUri(`/api/v1/games/match-prs/athletes/${athleteId}${queryString}`);

      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      const json = (await res.json()) as SingleMatchPowerRanking[];
      console.log('Past Matches ', json);

      return json;
    } catch (error) {
      console.log('Error fetching past match prs ', error);
      logger.error('Error fetching athlete matchs power rankings ', error);
      return [];
    }
  },
};
