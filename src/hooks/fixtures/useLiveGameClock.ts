import { useEffect, useState, useRef } from 'react';
import { isGameLive } from '../../utils/fixtureUtils';

/**
 * Parses a game clock string in MM:SS format to total seconds
 * @param clockString - Time string in "MM:SS" format (e.g., "45:30")
 * @returns Total seconds or null if invalid
 */
function parseGameClock(clockString?: string): number | null {
  if (!clockString) return null;

  // Handle special states like "HT", "FT", etc.
  if (clockString.length <= 3 && !clockString.includes(':')) {
    return null;
  }

  const parts = clockString.split(':');
  if (parts.length !== 2) return null;

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  if (isNaN(minutes) || isNaN(seconds)) return null;

  return minutes * 60 + seconds;
}

/**
 * Formats seconds to MM:SS format
 * @param totalSeconds - Total seconds to format
 * @returns Formatted time string "MM:SS"
 */
function formatGameClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface UseLiveGameClockProps {
  gameStatus?: string;
  serverGameClock?: string;
}

/**
 * Custom hook that maintains a live running game clock that syncs with server data
 * - Runs a local timer that increments every second
 * - Syncs with server game_clock value when it updates (every 5 seconds)
 * - Pauses during halftime
 * - Auto-stops when game ends
 */
export function useLiveGameClock({
  gameStatus,
  serverGameClock,
}: UseLiveGameClockProps): string | null {
  const [localSeconds, setLocalSeconds] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isLive = isGameLive(gameStatus);
  const isHalftime =
    gameStatus?.toLowerCase().includes('half') || gameStatus?.toUpperCase() === 'HT';

  // Initialize or sync local clock with server clock
  useEffect(() => {
    if (!isLive) {
      setLocalSeconds(null);
      return;
    }

    const serverSeconds = parseGameClock(serverGameClock);
    if (serverSeconds !== null) {
      setLocalSeconds(serverSeconds);
    }
  }, [serverGameClock, isLive]);

  // Run the local timer
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't run timer if game is not live, in halftime, or we don't have a valid time
    if (!isLive || isHalftime || localSeconds === null) {
      return;
    }

    // Start interval to increment clock every second
    intervalRef.current = setInterval(() => {
      setLocalSeconds(prev => (prev !== null ? prev + 1 : null));
    }, 1000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLive, isHalftime, localSeconds]);

  // Return formatted clock or null
  if (!isLive || localSeconds === null) {
    return serverGameClock || null;
  }

  return formatGameClock(localSeconds);
}
