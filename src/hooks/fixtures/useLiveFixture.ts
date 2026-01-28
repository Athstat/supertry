import useSWR from 'swr';
import { IFixture } from '../../types/fixtures';
import { gamesService } from '../../services/gamesService';
import { isGameLive } from '../../utils/fixtureUtils';

interface UseLiveFixtureProps {
  fixture: IFixture;
  enabled?: boolean;
}

/**
 * Custom hook that polls for live fixture updates every 5 seconds when a game is in progress
 * - Automatically starts polling when game status indicates it's live
 * - Stops polling when game ends
 * - Returns updated fixture data including scores, status, and game_clock
 */
export function useLiveFixture({ fixture, enabled = true }: UseLiveFixtureProps) {
  const shouldPoll = enabled && isGameLive(fixture?.game_status);

  // Create a unique key for this fixture
  const swrKey = shouldPoll && fixture?.game_id ? `live-fixture-${fixture.game_id}` : null;

  const { data, error, isLoading } = useSWR<IFixture>(
    swrKey,
    () => gamesService.getGameById(fixture.game_id),
    {
      refreshInterval: shouldPoll ? 5000 : 0, // Poll every 5 seconds when live
      revalidateOnFocus: false, // Don't refetch on window focus
      revalidateOnReconnect: true, // Do refetch on reconnect
      dedupingInterval: 4000, // Dedupe requests within 4 seconds
    }
  );

  return {
    liveFixture: data,
    isLoading,
    error,
    isPolling: shouldPoll,
  };
}
