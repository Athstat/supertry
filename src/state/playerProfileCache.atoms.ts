/** Global atoms for caching player profile data to enable instant loading */

import { atom } from 'jotai';
import { IProAthlete } from '../types/athletes';
import { IProSeason } from '../types/season';

/** Cache status for tracking prefetch state */
export type PlayerCacheStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Global cache for player profiles, keyed by tracking_id */
export const teamPlayersProfileCacheAtom = atom<Map<string, IProAthlete>>(new Map());

/** Global cache for player seasons data, keyed by tracking_id */
export const teamPlayersSeasonsCacheAtom = atom<Map<string, IProSeason[]>>(new Map());

/** Status atom to track the overall cache state */
export const playerCacheStatusAtom = atom<PlayerCacheStatus>('idle');

/** Atom to track which players have been cached */
export const cachedPlayerIdsAtom = atom<Set<string>>(new Set<string>());

/** Helper atom to check if a specific player is cached */
export const isPlayerCachedAtom = atom(null, (get, set, trackingId: string) => {
  const profileCache = get(teamPlayersProfileCacheAtom);
  const seasonsCache = get(teamPlayersSeasonsCacheAtom);
  return profileCache.has(trackingId) && seasonsCache.has(trackingId);
});

/** Helper atom to get cached player data */
export const getCachedPlayerDataAtom = atom(null, (get, set, trackingId: string) => {
  const profileCache = get(teamPlayersProfileCacheAtom);
  const seasonsCache = get(teamPlayersSeasonsCacheAtom);

  return {
    profile: profileCache.get(trackingId),
    seasons: seasonsCache.get(trackingId),
  };
});

/** Helper atom to set cached player data */
export const setCachedPlayerDataAtom = atom(
  null,
  (get, set, data: { trackingId: string; profile: IProAthlete; seasons: IProSeason[] }) => {
    const profileCache = get(teamPlayersProfileCacheAtom);
    const seasonsCache = get(teamPlayersSeasonsCacheAtom);
    const cachedIds = get(cachedPlayerIdsAtom);

    // Create new Maps to trigger re-render
    const newProfileCache = new Map(profileCache);
    const newSeasonsCache = new Map(seasonsCache);
    const newCachedIds = new Set(cachedIds);

    newProfileCache.set(data.trackingId, data.profile);
    newSeasonsCache.set(data.trackingId, data.seasons);
    newCachedIds.add(data.trackingId);

    set(teamPlayersProfileCacheAtom, newProfileCache);
    set(teamPlayersSeasonsCacheAtom, newSeasonsCache);
    set(cachedPlayerIdsAtom, newCachedIds);
  }
);
