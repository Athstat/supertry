import useSWR from 'swr';
import { IProAthlete } from '../../types/athletes';
import { swrFetchKeys } from '../../utils/swrKeys';
import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
import { useEffect, useMemo, useState } from 'react';
import { groupSportActions } from '../../services/athletes/athleteService';
import { IProSeason } from '../../types/season';

export default function usePlayerStats(player: IProAthlete) {

  const playerStatsKey = swrFetchKeys.getAthleteAggregatedStats(player.tracking_id);
  const { data, isLoading: loadingPlayerStats } = useSWR(playerStatsKey, () => djangoAthleteService.getAthleteSportsActions(player.tracking_id));

  const seasons: IProSeason[] = useMemo(() => {
    return [];
  }, []);

  const playerStats = useMemo(() => {
    return data || []
  }, [data]);

  playerStats.forEach((ps) => {
    if (!seasons.some(x => x.id === ps.season.id)) {
      seasons.push(ps.season);
    }
  });

  seasons.sort((a, b) => {
    const aEnd = new Date(a.end_date);
    const bEnd = new Date(b.end_date);

    return bEnd.valueOf() - aEnd.valueOf();
  })

  const [currSeason, setCurrSeason] = useState<IProSeason | undefined>(
    seasons.length > 0 ? seasons[0] : undefined
  );

  // Ensure currSeason is set once seasons are fetched
  useEffect(() => {
    if (!currSeason && seasons.length > 0) {
      setCurrSeason(seasons[0]);
    }
  }, [seasons, currSeason]);

  const seasonPlayerStats = useMemo(() => {
    return playerStats.filter((p) => p.season_id === currSeason?.id);
  }, [playerStats, currSeason]);

  const groupedStats = useMemo(() => {
    return groupSportActions(seasonPlayerStats);
  }, [seasonPlayerStats]);

  const { starRatings, isLoading: loadingStarRatings, error: starRatingsErros } =
    useAthleteStarRatings(player, currSeason?.id ?? null);


  return {
    currSeason,
    setCurrSeason,
    starRatings,
    loadingPlayerStats,
    loadingStarRatings,
    starRatingsErros,
    groupedStats,
    seasons,
    playerStats,
    seasonPlayerStats
  }
};


/** Fetches star ratings for a player based on a given season */
export function useAthleteStarRatings(player: IProAthlete, seasonId: string | null) {
  const key = useMemo(() => {
    return seasonId ? swrFetchKeys.getAthleteSeasonStarRatings(player.tracking_id, seasonId) : null;
  }, [seasonId, player]);

  const { data: starRatings, isLoading, error } = useSWR(key, () => djangoAthleteService.getAthleteSeasonStarRatings(
    player.tracking_id, seasonId ?? ""
  ))

  return {
    starRatings, isLoading, error
  }
}