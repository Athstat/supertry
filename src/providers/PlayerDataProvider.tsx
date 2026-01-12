 
import useSWR from 'swr';
import { ScopeProvider } from 'jotai-scope';
import { IProAthlete } from '../types/athletes';
import { swrFetchKeys } from '../utils/swrKeys';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Fragment, ReactNode, useEffect, useMemo } from 'react';
import { IFantasyTeamAthlete } from '../types/fantasyTeamAthlete';
import { djangoAthleteService } from '../services/athletes/djangoAthletesService';
import { playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom, playerSelectedFixtureAtom, showPlayerScoutingActionsModalAtom } from '../state/player.atoms';

type Props = {
  children?: ReactNode;
  player: IProAthlete | IFantasyTeamAthlete;
  onClose?: () => void;
  loadingFallback?: ReactNode,
  errorFallback?: ReactNode,
  shouldRefetch?: boolean
};

/** Provides a players data and stats down to child components */
export default function PlayerDataProvider({ children, player, onClose, loadingFallback, errorFallback, shouldRefetch }: Props) {
  const atoms = [
    playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom,
    playerSelectedFixtureAtom, showPlayerScoutingActionsModalAtom
  ];

  return (
    <ScopeProvider atoms={atoms}>
      <ProviderInner errorFallback={errorFallback} shouldRefetch={shouldRefetch} player={player} onClose={onClose} loadingFallback={loadingFallback} >
        {children}
      </ProviderInner>
    </ScopeProvider>
  );
}

function ProviderInner({ children, player, loadingFallback, errorFallback, shouldRefetch: shouldRefetchPlayer }: Props) {
  const setPlayer = useSetAtom(playerAtom);
  const setSeasons = useSetAtom(playerSeasonsAtom);

  const shouldFetchSeason = true;

  const seasonFetchKey = shouldFetchSeason ? swrFetchKeys.getAthleteSeasons(player.tracking_id) : null;
  const { data: seasons, isLoading: loadingSeasons } = useSWR(seasonFetchKey, () =>
    djangoAthleteService.getAthleteSeasons(player.tracking_id)
  );

  const playerKey = shouldRefetchPlayer ? swrFetchKeys.getAthleteById(player.tracking_id) : null;
  const { data: fetchedPlayer, isLoading: loadingPlayer } = useSWR(playerKey, () =>
    djangoAthleteService.getAthleteById(player.tracking_id)
  );

  const isLoading = loadingPlayer || loadingSeasons;

  useEffect(() => {
    
    if (fetchedPlayer) {
      setPlayer(fetchedPlayer);
    }

    if (seasons) {
      setSeasons(seasons);
    }

  }, [fetchedPlayer, seasons, setPlayer, setSeasons]);

  if (!isLoading && !fetchedPlayer && errorFallback) {
    return (
      <>{errorFallback}</>
    )
  }

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

