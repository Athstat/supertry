import { atom, useAtomValue } from 'jotai';
import { IProAthlete } from '../../types/athletes';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';

export const featuredPlayersAtom = atom<IProAthlete[]>([]);
export const featuredLeagueAtom = atom<FantasyLeagueGroup>();


export function useOnboarding() {
  const featuredPlayers = useAtomValue(featuredPlayersAtom);
  const featuredLeague = useAtomValue(featuredLeagueAtom);

  return {
    featuredLeague,
    featuredPlayers,
  };
}
