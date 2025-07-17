import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService';
import { IProAthlete } from '../../../types/athletes';
import { swrFetchKeys } from '../../../utils/swrKeys';
import useSWR from 'swr';

export default function usePlayerStats(player: IProAthlete) {

  const key = swrFetchKeys.getAthleteAggregatedStats(player.tracking_id);
  const {data: playerStats, isLoading, error} = useSWR(key, () => djangoAthleteService.getAthleteSportsActions(player.tracking_id));

  
  if (!isLoading) {
    console.log("Some Player Stats ", playerStats);
  }

  return { playerStats, isLoading, error };
};