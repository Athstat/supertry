import { athleteService } from '../../../services/athletes/athleteService';
import { IProAthlete } from '../../../types/athletes';
import { swrFetchKeys } from '../../../utils/swrKeys';
import useSWR from 'swr';

export default function usePlayerStats(player: IProAthlete) {

  const key = swrFetchKeys.getAthleteAggregatedStats(player.tracking_id);
  const {data: playerStats, isLoading, error} = useSWR(key, () => athleteStatsFetcher(player));

  return { playerStats, isLoading, error };
};


async function athleteStatsFetcher(player?: IProAthlete) {

  if (!player) {
    console.log('No player data available');
    return undefined;
  }
  
  try {

    const athleteId = player.tracking_id;
    const stats = await athleteService.getAthleteStats(athleteId);
    console.log('Fetched player stats:', stats);

    return stats;

  } catch (err) {
    console.error('Error fetching player statistics:', err);
  }

  return undefined;
};