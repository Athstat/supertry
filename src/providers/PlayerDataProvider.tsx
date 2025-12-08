import { ScopeProvider } from 'jotai-scope';
import { Fragment, ReactNode, useEffect, useMemo, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';
import RoundedCard from '../components/shared/RoundedCard';
import { djangoAthleteService } from '../services/athletes/djangoAthletesService';
import { playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom } from '../state/player.atoms';
import { IProAthlete } from '../types/athletes';
import { IFantasyTeamAthlete } from '../types/fantasyTeamAthlete';
import { swrFetchKeys } from '../utils/swrKeys';
import {
  teamPlayersProfileCacheAtom,
  teamPlayersSeasonsCacheAtom,
} from '../state/playerProfileCache.atoms';
import { twMerge } from 'tailwind-merge';
import BottomSheetView from '../components/ui/BottomSheetView';
import { lighterDarkBlueCN } from '../types/constants';
import { useClickOutside } from '../hooks/useClickOutside';

type Props = {
  children?: ReactNode;
  player: IProAthlete | IFantasyTeamAthlete;
  onClose?: () => void;
};

/** Provides a players data and stats down to child components */
export default function PlayerDataProvider({ children, player, onClose }: Props) {
  const atoms = [playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <ProviderInner player={player} onClose={onClose}>
        {children}
      </ProviderInner>
    </ScopeProvider>
  );
}

function ProviderInner({ children, player, onClose }: Props) {
  const setPlayer = useSetAtom(playerAtom);
  const setSeasons = useSetAtom(playerSeasonsAtom);

  // Check global cache first
  const profileCache = useAtomValue(teamPlayersProfileCacheAtom);
  const seasonsCache = useAtomValue(teamPlayersSeasonsCacheAtom);

  const cachedProfile = profileCache.get(player.tracking_id);
  const cachedSeasons = seasonsCache.get(player.tracking_id);

  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(divRef, onClose);

  // Only fetch if not in cache
  const shouldFetch = !cachedProfile || !cachedSeasons;

  const seasonFetchKey = shouldFetch ? swrFetchKeys.getAthleteSeasons(player.tracking_id) : null;
  const { data: seasons, isLoading: loadingSeasons } = useSWR(seasonFetchKey, () =>
    djangoAthleteService.getAthleteSeasons(player.tracking_id)
  );

  const playerKey = shouldFetch ? swrFetchKeys.getAthleteById(player.tracking_id) : null;
  const { data: fetchedPlayer, isLoading: loadingPlayer } = useSWR(playerKey, () =>
    djangoAthleteService.getAthleteById(player.tracking_id)
  );

  const isLoading = shouldFetch && (loadingPlayer || loadingSeasons);

  useEffect(() => {
    // Use cached data if available, otherwise use fetched data
    if (cachedProfile) {
      setPlayer(cachedProfile);
    } else if (fetchedPlayer) {
      setPlayer(fetchedPlayer);
    }

    if (cachedSeasons) {
      setSeasons(cachedSeasons);
    } else if (seasons) {
      setSeasons(seasons);
    }
  }, [player, seasons, fetchedPlayer, cachedProfile, cachedSeasons, setPlayer, setSeasons]);

  if (isLoading) {
    return (
      <div ref={divRef} >
        <BottomSheetView
          className={twMerge(
            "p-0 flex flex-col gap-6 min-h-[95vh] overflow-y-auto",
            lighterDarkBlueCN
          )}

          hideHandle
        >
          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[200px]"></RoundedCard>

          <div className="flex flex-row px-4 justify-between">
            <div className="flex flex-col gap-2">
              <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[30px] w-[120px]" />
              <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[30px] w-[60px]" />
            </div>

            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[30px] w-[60px]" />
          </div>

          <div className="flex px-4 flex-row gap-2 items-center">
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[60px] flex-1 " />
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[60px] flex-1" />
          </div>

          <div className='flex flex-col gap-4 px-4' >
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[100px] w-full" />
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[50px] w-full" />
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[100px] w-full" />
          </div>
        </BottomSheetView>
      </div>
    );
  }

  return <Fragment>{children}</Fragment>;
}

/** A hook that provides data from the PlayerDataProvider */

export function usePlayerData() {
  const [player] = useAtom(playerAtom);
  const [seasons] = useAtom(playerSeasonsAtom);
  const currentSeason = useAtomValue(playerCurrentSeasonAtom);

  const sortedSeasons = useMemo(() => {
    return [...seasons].sort((a, b) => {
      const aEnd = new Date(a.end_date);
      const bEnd = new Date(b.end_date);

      return bEnd.valueOf() - aEnd.valueOf();
    });
  }, [seasons]);

  return { player, seasons, currentSeason, sortedSeasons };
}
