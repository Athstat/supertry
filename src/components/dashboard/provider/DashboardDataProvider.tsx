import { Fragment, ReactNode, useEffect } from 'react';
import { fantasySeasonsAtom } from '../../../state/fantasy/fantasyLeagueScreen.atoms';
import { fantasySeasonsAtoms } from '../../../state/dashboard/dashboard.atoms';
import { ScopeProvider } from 'jotai-scope';
import { useAtom, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { fantasySeasonsService } from '../../../services/fantasy/fantasySeasonsService';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { seasonService } from '../../../services/seasonsService';
import { logger } from '../../../services/logger';
import PageView from '../../../screens/PageView';
import RoundedCard from '../../shared/RoundedCard';

import { useDebounced } from '../../../hooks/useDebounced';
import { DashboardHeroLoadingSkeleton } from '../hero/DashboardHeroSections';

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

  const seasonsKey = swrFetchKeys.getActiveFantasySeasons();
  const { data: seasonsFetched, isLoading: loadingSeasons } = useSWR(seasonsKey, () =>
    fantasySeasonsService.getAllFantasySeasons(true)
  );

  const roundsKey = currentSeason ? swrFetchKeys.getSeasonRounds(currentSeason.id) : null;
  const { data: roundsFetched, isLoading: loadingRounds } = useSWR(roundsKey, () =>
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
    if (fantasySeasons && fantasySeasons.length > 0) {
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

// TODO: Put this loading skeleton on the dashboard
function LoadingSkeleton() {
  return (
    <PageView className="flex flex-col space-y-4 py-4">
      <div className="flex flex-col gap-2">
        <DashboardHeroLoadingSkeleton />

        <div className='w-full p-4' >
          <RoundedCard className="w-full bg-slate-200 dark:bg-gray-800 h-[100px] border-none animate-pulse" />
        </div>

        <div>
          <RoundedCard className="w-full rounded-none bg-slate-200 dark:bg-gray-800 h-[160px] border-none animate-pulse" />
        </div>

        <div className='p-4'>
          <RoundedCard className="w-full bg-slate-200 dark:bg-gray-800 h-[450px] border-none animate-pulse" />
        </div>

        <div className='p-4'>
          <RoundedCard className="w-full bg-slate-200 dark:bg-gray-800 h-[150px] border-none animate-pulse" />
        </div>
      </div>
    </PageView>
  );
}
