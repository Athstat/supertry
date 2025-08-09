import { useEffect, useState } from 'react';
import { IFantasyLeague } from '../../types/fantasyLeague';
import { getRoundFixtures } from '../../utils/fixtureUtils';
import { isLeagueLocked } from '../../utils/leaguesUtils';
import { twMerge } from 'tailwind-merge';
import { useFetch } from '../../hooks/useFetch';
import { gamesService } from '../../services/gamesService';

type Props = {
  league: IFantasyLeague;
  className?: string;
  getGamesByCompetitionId?: (competitionId: string) => any[];
};

/** Renders a red dot when a league is live */
export default function LeagueLiveIndicator({ league, className, getGamesByCompetitionId }: Props) {
  const [isLive, setLive] = useState(false);
  const isLocked = isLeagueLocked(league.join_deadline);

  // Fallback to direct API call if getGamesByCompetitionId is not provided
  const { data: fallbackGames } = useFetch(
    'games-fallback',
    getGamesByCompetitionId ? '' : (league.official_league_id || ''),
    getGamesByCompetitionId ? () => Promise.resolve([]) : gamesService.getGamesByCompetitionId
  );

  useEffect(() => {
    if (!league.official_league_id) {
      setLive(false);
      return;
    }

    // Get games from prop function or fallback API call
    const games = getGamesByCompetitionId && league.official_league_id 
      ? getGamesByCompetitionId(league.official_league_id) 
      : (fallbackGames || []);
    
    const fixtures = games || [];
    
    if (fixtures.length === 0) {
      setLive(false);
      return;
    }

    const roundFixtures = getRoundFixtures(
      fixtures,
      league.start_round ?? 0,
      league.end_round ?? 0
    );

    if (roundFixtures.length === 0) {
      setLive(false);
      return;
    }

    // Check if any match in the current round is live
    const now = new Date();
    const isCurrentlyLive = roundFixtures.some(fixture => {
      if (!fixture.kickoff_time) return false;
      
      const kickoffTime = new Date(fixture.kickoff_time);
      const timeDiff = now.getTime() - kickoffTime.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Consider live if within 2 hours after kickoff
      return minutesDiff >= 0 && minutesDiff <= 120;
    });

    setLive(isCurrentlyLive);
  }, [league, getGamesByCompetitionId, fallbackGames]);

  if (isLocked || !isLive) return null;

  return (
    <div className={twMerge('flex items-center gap-1', className)}>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <span className="text-xs text-red-500 font-medium">LIVE</span>
    </div>
  );
}

export function LeagueLiveIndicatorSolid({ league, className, getGamesByCompetitionId }: Props) {
  const [isLive, setLive] = useState(false);
  const isLocked = isLeagueLocked(league.join_deadline);

  // Fallback to direct API call if getGamesByCompetitionId is not provided
  const { data: fallbackGames } = useFetch(
    'games-fallback-solid',
    getGamesByCompetitionId ? '' : (league.official_league_id || ''),
    getGamesByCompetitionId ? () => Promise.resolve([]) : gamesService.getGamesByCompetitionId
  );

  useEffect(() => {
    if (!league.official_league_id) {
      setLive(false);
      return;
    }

    // Get games from prop function or fallback API call
    const games = getGamesByCompetitionId && league.official_league_id 
      ? getGamesByCompetitionId(league.official_league_id) 
      : (fallbackGames || []);
    
    const fixtures = games || [];
    
    if (fixtures.length === 0) {
      setLive(false);
      return;
    }

    const roundFixtures = getRoundFixtures(
      fixtures,
      league.start_round ?? 0,
      league.end_round ?? 0
    );

    if (roundFixtures.length === 0) {
      setLive(false);
      return;
    }

    // Check if any match in the current round is live
    const now = new Date();
    const isCurrentlyLive = roundFixtures.some(fixture => {
      if (!fixture.kickoff_time) return false;
      
      const kickoffTime = new Date(fixture.kickoff_time);
      const timeDiff = now.getTime() - kickoffTime.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Consider live if within 2 hours after kickoff
      return minutesDiff >= 0 && minutesDiff <= 120;
    });

    setLive(isCurrentlyLive);
  }, [league, getGamesByCompetitionId, fallbackGames]);

  if (isLocked || !isLive) return null;

  return (
    <div className={twMerge(
      'inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium',
      className
    )}>
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      LIVE
    </div>
  );
}

export function LeagueLiveIndicatorDot({ league, className, getGamesByCompetitionId }: Props) {
  const [isLive, setLive] = useState(false);
  const isLocked = isLeagueLocked(league.join_deadline);

  // Fallback to direct API call if getGamesByCompetitionId is not provided
  const { data: fallbackGames } = useFetch(
    'games-fallback-dot',
    getGamesByCompetitionId ? '' : (league.official_league_id || ''),
    getGamesByCompetitionId ? () => Promise.resolve([]) : gamesService.getGamesByCompetitionId
  );

  useEffect(() => {
    if (!league.official_league_id) {
      setLive(false);
      return;
    }

    // Get games from prop function or fallback API call
    const games = getGamesByCompetitionId && league.official_league_id 
      ? getGamesByCompetitionId(league.official_league_id) 
      : (fallbackGames || []);
    
    const fixtures = games || [];
    
    if (fixtures.length === 0) {
      setLive(false);
      return;
    }

    const roundFixtures = getRoundFixtures(
      fixtures,
      league.start_round ?? 0,
      league.end_round ?? 0
    );

    if (roundFixtures.length === 0) {
      setLive(false);
      return;
    }

    // Check if any match in the current round is live
    const now = new Date();
    const isCurrentlyLive = roundFixtures.some(fixture => {
      if (!fixture.kickoff_time) return false;
      
      const kickoffTime = new Date(fixture.kickoff_time);
      const timeDiff = now.getTime() - kickoffTime.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Consider live if within 2 hours after kickoff
      return minutesDiff >= 0 && minutesDiff <= 120;
    });

    setLive(isCurrentlyLive);
  }, [league, getGamesByCompetitionId, fallbackGames]);

  if (isLocked || !isLive) return null;

  return (
    <div className={twMerge('w-2 h-2 bg-red-500 rounded-full animate-pulse', className)} />
  );
}
