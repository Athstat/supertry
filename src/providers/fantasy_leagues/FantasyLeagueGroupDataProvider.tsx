import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import { ScopeProvider } from 'jotai-scope';
import { useAtom, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { useLocation } from 'react-router-dom';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useLeagueConfig } from '../../hooks/useLeagueConfig';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { fantasyLeagueGroupAtom, fantasyLeagueGroupMembersAtom, fantasyLeagueGroupRoundsAtom, currGroupMemberAtom, fantasyLeagueConfigAtom, fantasyLeagueGroupLoadingAtom } from '../../state/fantasy/fantasyLeagueGroup.atoms';
import { swrFetchKeys } from '../../utils/swrKeys';

type Props = {
  children?: ReactNode;
  leagueId?: string;
  loadingFallback?: ReactNode;
  skipCache?: boolean;
  fetchMembers?: boolean;
};

export default function FantasyLeagueGroupDataProvider({
  children,
  leagueId,
  loadingFallback,
  skipCache,
  fetchMembers
}: Props) {
  const atoms = [
    fantasyLeagueGroupAtom,
    fantasyLeagueGroupMembersAtom,
    fantasyLeagueGroupRoundsAtom,
    currGroupMemberAtom,
    fantasyLeagueConfigAtom,
    fantasyLeagueGroupLoadingAtom,
  ];

  return (
    <ScopeProvider atoms={atoms}>
      <Fetcher
        leagueId={leagueId}
        loadingFallback={loadingFallback}
        skipCache={skipCache}
        fetchMembers={fetchMembers}
      >
        {children}
      </Fetcher>
    </ScopeProvider>
  );
}

function Fetcher({ children, leagueId, loadingFallback, skipCache = false, fetchMembers = true }: Props) {

  const [leagueGroup, setFantasyLeagueGroup] = useAtom(fantasyLeagueGroupAtom);
  const setFantasyLeagueMembers = useSetAtom(fantasyLeagueGroupMembersAtom);
  const setFantasyLeagueGroupRounds = useSetAtom(fantasyLeagueGroupRoundsAtom);
  const setLeagueConfig = useSetAtom(fantasyLeagueConfigAtom);
  const setLoadingState = useSetAtom(fantasyLeagueGroupLoadingAtom);

  const { state } = useLocation();

  const { leagueConfig, isLoading: loadingConfig } = useLeagueConfig(leagueGroup?.season_id);

  const key = useMemo(() => {
    if (!leagueId) {
      return null;
    }

    return !skipCache ? (swrFetchKeys.getFantasyLeagueGroupById(leagueId)) : `/fantasy-league-groups/skip-cache/${new Date()}`;
  }, [leagueId, skipCache]);

  const { data: leagueData, isLoading: loadingLeague, mutate: refreshLeague } = useSWR(key, () =>
    fetcher(leagueId ?? '', fetchMembers)
  , {
    revalidateOnFocus: false,
    revalidateIfStale: true
  });

  const league = leagueData?.league;
  const members = useMemo(() => leagueData?.members || [], [leagueData]);
  const rounds = useMemo(() => leagueData?.rounds || [], [leagueData]);

  const [isMutating, setMutate] = useState<boolean>(false);
  const isLoading = loadingLeague || isMutating || loadingConfig;

  useEffect(() => {
    if (league) setFantasyLeagueGroup(league);
    if (members) setFantasyLeagueMembers(members);
    if (rounds) setFantasyLeagueGroupRounds(rounds);
  }, [
    league,
    members,
    rounds,
    setFantasyLeagueGroup,
    setFantasyLeagueGroupRounds,
    setFantasyLeagueMembers,
  ]);

  useEffect(() => {
    const reloadMembers = async () => {
      if (state?.reloadApp === true) {
        setMutate(true);
        await refreshLeague(() => fetcher(leagueId ?? '', fetchMembers));
        setMutate(false);
      }
    };

    reloadMembers();
  }, [fetchMembers, leagueId, refreshLeague, state]);

  useEffect(() => {
    if (leagueConfig) {
      setLeagueConfig(leagueConfig);
    }
  }, [leagueConfig, setLeagueConfig]);

  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading, setLoadingState]);

  if (isLoading) {
    return (
      <Fragment>
        {loadingFallback ? <Fragment>{loadingFallback}</Fragment> : <LoadingIndicator />}
      </Fragment>
    );
  }

  return <>{children}</>;
}


async function fetcher(leagueId?: string, fetchMembers?: boolean)  {

  const league = await fantasyLeagueGroupsService.getGroupById(leagueId ?? '');

  const shouldFetchMembers = leagueId && fetchMembers;

  const members = shouldFetchMembers ?
     await fantasyLeagueGroupsService.getGroupMembers(leagueId || '')
     : [];

  const rounds = leagueId ? 
    await fantasyLeagueGroupsService.getGroupRounds(leagueId ?? '')
    : [];

    return {
      league,
      members,
      rounds
    }
}