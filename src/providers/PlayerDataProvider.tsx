import useSWR from 'swr';
import { ScopeProvider } from 'jotai-scope';
import { IProAthlete } from '../types/athletes';
import { swrFetchKeys } from '../utils/swrKeys';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Fragment, ReactNode, useEffect, useMemo} from 'react';
import { IFantasyTeamAthlete } from '../types/fantasyTeamAthlete';
import { djangoAthleteService } from '../services/athletes/djangoAthletesService';
import { teamPlayersProfileCacheAtom, teamPlayersSeasonsCacheAtom, } from '../state/playerProfileCache.atoms';
import { playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom, playerSelectedFixtureAtom, showPlayerScoutingActionsModalAtom } from '../state/player.atoms';

type Props = {
  children?: ReactNode;
  player: IProAthlete | IFantasyTeamAthlete;
  onClose?: () => void;
  loadingFallback?: ReactNode
};

/** Provides a players data and stats down to child components */
export default function PlayerDataProvider({ children, player, onClose, loadingFallback }: Props) {
  const atoms = [
    playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom,
    playerSelectedFixtureAtom, showPlayerScoutingActionsModalAtom
  ];

  return (
    <ScopeProvider atoms={atoms}>
      <ProviderInner player={player} onClose={onClose} loadingFallback={loadingFallback} >
        {children}
      </ProviderInner>
    </ScopeProvider>
  );
}

function ProviderInner({ children, player, loadingFallback }: Props) {
  const setPlayer = useSetAtom(playerAtom);
  const setSeasons = useSetAtom(playerSeasonsAtom);

  // Check global cache first
  const profileCache = useAtomValue(teamPlayersProfileCacheAtom);
  const seasonsCache = useAtomValue(teamPlayersSeasonsCacheAtom);

  const cachedProfile = profileCache.get(player.tracking_id);
  const cachedSeasons = seasonsCache.get(player.tracking_id);



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
      <>{loadingFallback}</>
    )
  }

  return <Fragment>{children}</Fragment>;
}

/** A hook that provides data from the PlayerDataProvider */

export function usePlayerData() {
  const [player] = useAtom(playerAtom);
  const [seasons] = useAtom(playerSeasonsAtom);
  const currentSeason = useAtomValue(playerCurrentSeasonAtom);
  const [selectedFixture, setSelectedFixture] = useAtom(playerSelectedFixtureAtom);
  const [showScoutingActionModal, setShowScoutingActionModal] = useAtom(showPlayerScoutingActionsModalAtom);

  const sortedSeasons = useMemo(() => {
    return [...seasons].sort((a, b) => {
      const aEnd = new Date(a.end_date);
      const bEnd = new Date(b.end_date);

      return bEnd.valueOf() - aEnd.valueOf();
    });
  }, [seasons]);

  return {
    player, seasons, currentSeason,
    sortedSeasons, selectedFixture, setSelectedFixture,
    showScoutingActionModal, setShowScoutingActionModal
  };
}

