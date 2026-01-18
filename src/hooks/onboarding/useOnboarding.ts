import { atom, useAtomValue } from 'jotai';
import { IProAthlete } from '../../types/athletes';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { useContext } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';

export const featuredPlayersAtom = atom<IProAthlete[]>([]);
export const featuredLeagueAtom = atom<FantasyLeagueGroup>();

/** Hook for accessing the onboarding context */
export function useOnboarding() {

  const context = useContext(OnboardingContext);

  if (context === null) {
    throw new Error('useOnboarding() was used outside the OnboardingProvider');
  }

  const featuredPlayers = useAtomValue(featuredPlayersAtom);
  const featuredLeague = useAtomValue(featuredLeagueAtom);

  return {
    featuredLeague,
    featuredPlayers,
    ...context
  };
}
