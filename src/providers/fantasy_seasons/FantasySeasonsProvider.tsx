import { Fragment, ReactNode, useEffect } from 'react';
import { fantasySeasonsAtom } from '../../state/fantasy/fantasyLeagueScreen.atoms';
import { fantasySeasonsAtoms } from '../../state/dashboard/dashboard.atoms';
import { ScopeProvider } from 'jotai-scope';
import { useAtom, useSetAtom } from 'jotai';
import { fantasySeasonsService } from '../../services/fantasy/fantasySeasonsService';
import { swrFetchKeys } from '../../utils/swrKeys';
import { seasonService } from '../../services/seasonsService';
import { logger } from '../../services/logger';
import { useDebounced } from '../../hooks/web/useDebounced';
import useSWRImmutable from 'swr/immutable';
import useSWR from 'swr';
import { CACHING_CONFIG, SELECTED_SEASON_ID_KEY } from '../../types/constants';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  children?: ReactNode;
};

/** renders a Provider that provides Fantasy Seasons to its children */
export default function FantasySeasonsProvider({ children }: Props) {
  const atoms = [
    fantasySeasonsAtom,
    fantasySeasonsAtoms.currentSeasonAtom,
    fantasySeasonsAtoms.currentSeasonRoundAtom,
    fantasySeasonsAtoms.seasonRoundsAtom,
    fantasySeasonsAtoms.isFantasySeasonsLoadingAtom
  ];

  return (
    <ScopeProvider atoms={atoms}>
      <InnerProvider>{children}</InnerProvider>
    </ScopeProvider>
  );
}

function InnerProvider({ children }: Props) {
  const [fantasySeasons, setFantasySeasons] = useAtom(fantasySeasonsAtom);
  const [currentSeason, setCurrentSeason] = useAtom(fantasySeasonsAtoms.currentSeasonAtom);
  const [seasonRounds, setSeasonRounds] = useAtom(fantasySeasonsAtoms.seasonRoundsAtom);
  const [, setCurrentRound] = useAtom(fantasySeasonsAtoms.currentSeasonRoundAtom);
  const setLoading = useSetAtom(fantasySeasonsAtoms.isFantasySeasonsLoadingAtom);

  const {authUser} = useAuth();

  const seasonsKey = authUser ? swrFetchKeys.getActiveFantasySeasons(authUser?.kc_id) : null;
  const { data: seasonsFetched, isLoading: loadingSeasons } = useSWR(seasonsKey, () =>
    fantasySeasonsService.getAllFantasySeasons(true), {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: CACHING_CONFIG.fantasySeasonsCachePeriod
    }
  );

  const roundsKey = currentSeason ? swrFetchKeys.getSeasonRounds(currentSeason.id) : null;
  const { data: roundsFetched, isLoading: loadingRounds } = useSWRImmutable(roundsKey, () =>
    seasonService.getSeasonRounds(currentSeason?.id ?? '')
  );

  const isFetching = loadingRounds || loadingSeasons;
  const isFetchingDebounced = useDebounced(isFetching, 500);

  useEffect(() => {
    setLoading(isFetchingDebounced);
  }, [isFetchingDebounced, setLoading]);

  useEffect(() => {
    if (seasonsFetched) {
      setFantasySeasons(seasonsFetched);
    }
  }, [setFantasySeasons, seasonsFetched, loadingSeasons]);

  useEffect(() => {
    const prevSavedSeasonId = localStorage.getItem(SELECTED_SEASON_ID_KEY);
    
    if (fantasySeasons && fantasySeasons.length > 0) {
      
      const prevSavedSeason = fantasySeasons.find((s) => {
        return s.id === prevSavedSeasonId;
      })
      
      if (prevSavedSeason) {
        setCurrentSeason(prevSavedSeason);
        return;
      }
      

      setCurrentSeason(fantasySeasons[0]);
    }
  }, [setCurrentSeason, fantasySeasons]);

  useEffect(() => {
    if (roundsFetched) {
      setSeasonRounds(roundsFetched);
    }
  }, [roundsFetched, setSeasonRounds]);

  useEffect(() => {
    if (seasonRounds) {
      try {
        const firstActive = seasonRounds
          .filter(r => {
            return r.build_up_start && r.coverage_end;
          })
          .find(r => {
            const dateNow = new Date().valueOf();
            const start = new Date(r.build_up_start).valueOf();
            const end = new Date(r.coverage_end).valueOf();
            return dateNow >= start && dateNow <= end;
          });

        const seasonsLength = seasonRounds.length;

        setCurrentRound(firstActive || seasonRounds[seasonsLength - 1]);
      } catch (err) {
        logger.error('Error setting active season round ', err);
      }
    }
  }, [seasonRounds, setCurrentRound]);

  return (
    <Fragment>
      {children}
    </Fragment>
  );
}