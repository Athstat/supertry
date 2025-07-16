import { useState, useEffect } from 'react';
import { athleteService } from '../../../services/athletes/athleteService';
import { useLocation } from 'react-router-dom';

export const usePlayerStats = (player: any, isOpen: boolean) => {
  
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {state} = useLocation();
  const competitionId = state?.league?.official_league_id;

  // Fetch player statistics data
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!player) {
        console.log('No player data available');
        return;
      }

      // Log all available IDs to help debug
      // console.log('Player object:', player);
      // console.log('Available IDs:', {
      //   id: player.id,
      //   tracking_id: player.tracking_id,
      //   athlete_id: player.athlete_id
      // });

      // Use the first available ID in this priority order
      const athleteId = player.tracking_id || player.athlete_id || player.id;

      if (!athleteId) {
        console.warn('No valid ID found for player:', player.player_name);
        return;
      }

      setIsLoading(true);
      try {
        // console.log('Calling athleteService.getAthleteStats with ID:', athleteId);

        const stats = await athleteService.getAthleteStats(athleteId, competitionId);

        // console.log('Fetched player stats:', stats);

        setPlayerStats(stats);

      } catch (err) {
        console.error('Error fetching player statistics:', err);
        setError('Failed to load player statistics');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && player) {
      console.log('Player profile opened, fetching data...');
      fetchPlayerData();
    }
  }, [isOpen, player]);

  return { playerStats, isLoading, error };
};

export default usePlayerStats;
