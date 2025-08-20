import { atom, useAtomValue, useSetAtom } from 'jotai';
import { IProAthlete } from '../../types/athletes';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { ReactNode, useEffect } from 'react';
import ScrummyLoadingState from '../ui/ScrummyLoadingState';
import { ScopeProvider } from 'jotai-scope';

const featuredPlayersAtom = atom<IProAthlete[]>([]);
const featuredLeagueAtom = atom<FantasyLeagueGroup>();

type Props = {
  children?: ReactNode;
};

export default function OnboardingDataProvider({ children }: Props) {
  const atoms = [featuredLeagueAtom, featuredPlayersAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <ProviderContent>{children}</ProviderContent>
    </ScopeProvider>
  );
}

/** Provides data for the onboarding screen */
function ProviderContent({ children }: Props) {
  const featuredLeagueId: string = import.meta.env.VITE_FEATURE_LEAGUE_GROUP_ID ?? '';
  const apiTest: string = import.meta.env.VITE_API_BASE_URL ?? '';

  console.log('apiTest', apiTest);

  const featuredPlayersId: string[] = [
    'd703ed99-a89d-57b0-babd-f200b44fc274',
    'b932bcae-fae8-51b3-8056-8fdd897e8c56',
    // 'c280f4d7-87fe-5bec-a099-473ebd78f41f',
    // '1188cb47-a7cd-571d-8f96-676691517662',
  ];

  const setFeaturedLeague = useSetAtom(featuredLeagueAtom);
  const setFeaturedPlayers = useSetAtom(featuredPlayersAtom);

  const playersKey = `/onboarding/featured-players/${featuredLeagueId.length}`;
  const { data: players, isLoading: loadingPlayers } = useSWR(playersKey, () =>
    featuredPlayersFetcher(featuredPlayersId)
  );

  const groupKey = swrFetchKeys.getFantasyLeagueGroupById(featuredLeagueId);
  const { data: league, isLoading: loadingGroup } = useSWR(groupKey, () =>
    fantasyLeagueGroupsService.getGroupById(featuredLeagueId)
  );

  const isLoading = loadingPlayers || loadingGroup;

  useEffect(() => {
    if (league) {
      setFeaturedLeague(league);
    }

    if (players) {
      setFeaturedPlayers(players);
    }
  }, [players, league]);

  if (isLoading) {
    return <ScrummyLoadingState />;
  }

  return <>{children}</>;
}

async function featuredPlayersFetcher(ids: string[]) {
  const players: IProAthlete[] = [];

  const promises = ids.map(async (playerId: string) => {
    const res = await djangoAthleteService.getAthleteById(playerId);
    if (res) {
      players.push(res);
    }

    console.log('Whats up with the API?? ', res);
  });

  await Promise.all(promises);

  return players;
}

/** Hook that provides data from the onboarding data provider */
export function useOnboarding() {
  const featuredPlayers = useAtomValue(featuredPlayersAtom);
  const featuredLeague = useAtomValue(featuredLeagueAtom);

  return {
    featuredLeague,
    featuredPlayers,
  };
}
