import { useState, useEffect } from 'react';
import { athleteService, PowerRankingItem } from '../../../services/athleteService';

export interface UsePowerRankingsResult {
  data: PowerRankingItem[];
  isLoading: boolean;
  error: string | null;
}

export const usePowerRankings = (athleteId?: string): UsePowerRankingsResult => {
  const [data, setData] = useState<PowerRankingItem[]>([]);
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
        const rankingsData = await athleteService.getAthletePowerRankings(athleteId);
        
        // Sort by kickoff_time
        const sortedData = [...rankingsData].sort((a, b) => 
          new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime()
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
