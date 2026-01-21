import { useSetAtom } from 'jotai';
import useSWR from 'swr';
import { ReactNode, useEffect } from 'react';
import { ScopeProvider } from 'jotai-scope';
import ScrummyLoadingState from '../components/ui/ScrummyLoadingState';
import { featuredLeagueAtom, featuredPlayersAtom } from '../hooks/onboarding/useOnboarding';
import { athleteService } from '../services/athletes/athletesService';
import { fantasyLeagueGroupsService } from '../services/fantasy/fantasyLeagueGroupsService';
import { IProAthlete } from '../types/athletes';
import { DEFAULT_FALLBACK_FEATURED_LEAGUE_ID, FEATURED_PLAYER_IDS } from '../types/constants';
import { swrFetchKeys } from '../utils/swrKeys';


// Export so other screens (e.g., WelcomeScreen) can preload assets


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
  const featuredLeagueId: string = import.meta.env.VITE_FEATURE_LEAGUE_GROUP_ID ?? DEFAULT_FALLBACK_FEATURED_LEAGUE_ID;

  //console.log('apiTest', apiTest);

  const setFeaturedLeague = useSetAtom(featuredLeagueAtom);
  const setFeaturedPlayers = useSetAtom(featuredPlayersAtom);

  const playersKey = `/onboarding/featured-players/${featuredLeagueId.length}`;
  const { data: players, isLoading: loadingPlayers } = useSWR(playersKey, () =>
    featuredPlayersFetcherV2(FEATURED_PLAYER_IDS)
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
  }, [players, league, setFeaturedLeague, setFeaturedPlayers]);

  if (isLoading) {
    return <ScrummyLoadingState />;
  }

  return <>{children}</>;
}

// async function featuredPlayersFetcher() {
//   const featuredLeagueId: string = import.meta.env.VITE_FEATURE_LEAGUE_GROUP_ID ?? DEFAULT_FALLBACK_FEATURED_LEAGUE_ID;
//   const players = (await seasonService.getSeasonAthletes(featuredLeagueId))
//     .sort((a, b) => {
//       return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
//     })
    
//   console.log("Players ", players);

//   return players;
// }

async function featuredPlayersFetcherV2(ids: string[]) {
  const players: IProAthlete[] = [];

  const promises = ids.map(async (playerId: string) => {
    const res = await athleteService.getAthleteById(playerId);
    if (res) {
      players.push(res);
    }

    //console.log('Whats up with the API?? ', res);
  });

  await Promise.all(promises);

  return players;
}