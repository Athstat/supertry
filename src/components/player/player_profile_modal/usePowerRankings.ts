import { useState, useEffect } from 'react';
import { powerRankingsService } from '../../../services/powerRankingsService';
import { SingleMatchPowerRanking } from '../../../types/powerRankings';

export interface UsePowerRankingsResult {
  data: SingleMatchPowerRanking[];
  isLoading: boolean;
  error: string | null;
}

export const usePowerRankings = (athleteId?: string): UsePowerRankingsResult => {
  const [data, setData] = useState<SingleMatchPowerRanking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPowerRankings = async () => {
      if (!athleteId) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const currentSeasonId = import.meta.env.VITE_CURRENT_URC_SEASON_ID;
        const rankingsData = await powerRankingsService.getPastMatchsPowerRankings(
          athleteId,
          10,
          currentSeasonId
        );

        // Sort by kickoff_time
        const sortedData = [...rankingsData].sort(
          (a, b) =>
            new Date(a.game.kickoff_time ?? new Date()).getTime() -
            new Date(b.game.kickoff_time ?? new Date()).getTime()
        );

        setData(sortedData);
      } catch (err) {
        console.error('Error fetching power rankings:', err);
        setError('Failed to load power ranking history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPowerRankings();
  }, [athleteId]);

  return { data, isLoading, error };
};

export default usePowerRankings;
