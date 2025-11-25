import { Fragment, ReactNode, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { useAuth } from '../contexts/AuthContext';
import { djangoAthleteService } from '../services/athletes/djangoAthletesService';
import { playerCacheStatusAtom, setCachedPlayerDataAtom } from '../state/playerProfileCache.atoms';
import { logger } from '../services/logger';
import { getUri, getAuthHeader } from '../utils/backendUtils';
import { IFantasyTeamAthlete } from '../types/fantasyTeamAthlete';

type Props = {
  children?: ReactNode;
};

/**
 * Provider that prefetches player profile data for all players in the user's current team.
 * This runs silently in the background on dashboard load to enable instant player profile loads.
 */
export default function TeamPlayersPrefetchProvider({ children }: Props) {
  const { authUser } = useAuth();
  const setCacheStatus = useSetAtom(playerCacheStatusAtom);
  const setCachedPlayerData = useSetAtom(setCachedPlayerDataAtom);
  const [hasStartedPrefetch, setHasStartedPrefetch] = useState(false);

  useEffect(() => {
    // Only run prefetch once
    if (!authUser?.kc_id || hasStartedPrefetch) {
      return;
    }

    const prefetchTeamPlayers = async () => {
      try {
        setHasStartedPrefetch(true);
        setCacheStatus('loading');

        // Fetch user's active teams directly from API
        const uri = getUri(`/api/v1/fantasy/users/${authUser.kc_id}/active-team`);
        const res = await fetch(uri, {
          headers: getAuthHeader(),
        });

        if (!res.ok) {
          setCacheStatus('idle');
          return;
        }

        const teamData = await res.json();
        const athletes: IFantasyTeamAthlete[] = teamData?.athletes || [];

        if (athletes.length === 0) {
          setCacheStatus('idle');
          return;
        }

        // Extract unique tracking IDs from team athletes
        const trackingIds = Array.from(
          new Set(
            athletes.map(athlete => athlete.tracking_id).filter((id): id is string => Boolean(id))
          )
        );

        if (trackingIds.length === 0) {
          setCacheStatus('idle');
          return;
        }

        logger.debug(`[PlayerPrefetch] Starting prefetch for ${trackingIds.length} players`);

        // Prefetch all player profiles and seasons in parallel
        const prefetchPromises = trackingIds.map(async trackingId => {
          try {
            // Fetch player profile and seasons in parallel
            const [profile, seasons] = await Promise.all([
              djangoAthleteService.getAthleteById(trackingId),
              djangoAthleteService.getAthleteSeasons(trackingId),
            ]);

            if (profile && seasons) {
              // Filter to current season only to reduce data
              const currentSeason = seasons.find(season => {
                if (!season.end_date) return true;
                const endDate = new Date(season.end_date);
                return endDate >= new Date();
              });

              const seasonsToCache = currentSeason ? [currentSeason] : seasons.slice(0, 1);

              // Store in cache
              setCachedPlayerData({
                trackingId,
                profile,
                seasons: seasonsToCache,
              });

              return { success: true, trackingId };
            }

            return { success: false, trackingId, error: 'No data returned' };
          } catch (error) {
            logger.error(`[PlayerPrefetch] Failed to prefetch player ${trackingId}:`, error);
            return { success: false, trackingId, error };
          }
        });

        // Wait for all prefetch operations to complete
        const results = await Promise.allSettled(prefetchPromises);

        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        logger.debug(
          `[PlayerPrefetch] Completed: ${successful} successful, ${failed} failed out of ${trackingIds.length}`
        );

        setCacheStatus('loaded');
      } catch (error) {
        logger.error('[PlayerPrefetch] Prefetch error:', error);
        setCacheStatus('error');
      }
    };

    prefetchTeamPlayers();
  }, [authUser, hasStartedPrefetch, setCacheStatus, setCachedPlayerData]);

  return <Fragment>{children}</Fragment>;
}
