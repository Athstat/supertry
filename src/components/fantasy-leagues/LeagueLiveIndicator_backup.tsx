import { useEffect, useState, useCallback } from 'react';
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

    const fixtures = getGamesByCompetitionId(league.official_league_id) || [];
    
    if (fixtures.length === 0) {
      setLive(false);
      return;
    }

    const roundFixtures = getRoundFixtures(
      fixtures,
      league.start_round ?? 0,
      league.end_round ?? 0
    );

    const lastMatch = roundFixtures[roundFixtures.length - 1];
    if (!lastMatch?.kickoff_time) {
      setLive(false);
      return;
    }

    const lastMatchDate = new Date(lastMatch.kickoff_time);
    const now = new Date();
    const diff = now.valueOf() - lastMatchDate.valueOf();
    const threeHours = 1000 * 60 * 60 * 3;
    
    // League is live if the difference between match and now is under 3 hours
    setLive(diff <= threeHours && isLocked);
  }, [league, getGamesByCompetitionId]);

  if (!isLive) return;

  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-red-400/10 px-2.5 py-0.5 rounded-lg border border-red-500/20',
        className
      )}
    >
      <div className="relative">
        <div className="relative w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50" />
      </div>
      <span className="text-xs font-semibold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
        LIVE
      </span>
    </div>
  );
}

export function LeagueLiveIndicatorSolid({ league, className, getGamesByCompetitionId }: Props) {
  const [isLive, setLive] = useState(false);
  const isLocked = isLeagueLocked(league.join_deadline);

  useEffect(() => {
    if (!league.official_league_id) {
      setLive(false);
      return;
    }

    const fixtures = getGamesByCompetitionId(league.official_league_id) || [];
    
    if (fixtures.length === 0) {
      setLive(false);
      return;
    }

    const roundFixtures = getRoundFixtures(
      fixtures,
      league.start_round ?? 0,
      league.end_round ?? 0
    );

    const lastMatch = roundFixtures[roundFixtures.length - 1];
    if (!lastMatch?.kickoff_time) {
      setLive(false);
      return;
    }

    const lastMatchDate = new Date(lastMatch.kickoff_time);
    const now = new Date();
    const diff = now.valueOf() - lastMatchDate.valueOf();
    const threeHours = 1000 * 60 * 60 * 3;
    
    // League is live if the difference between match and now is under 3 hours
    setLive(diff <= threeHours && isLocked);
  }, [league, getGamesByCompetitionId]);

  if (!isLive) return;

  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 px-2.5 py-0.5 rounded-lg border border-red-500/20',
        className
      )}
    >
      <div className="relative">
        <div className="relative w-1.5 h-1.5 bg-white rounded-full shadow-sm shadow-red-500/50" />
      </div>
      <span className="text-xs font-semibold text-white">LIVE</span>
    </div>
  );
}

export function LeagueLiveIndicatorDot({ league, className, getGamesByCompetitionId }: Props) {
  const [isLive, setLive] = useState(false);
  const isLocked = isLeagueLocked(league.join_deadline);

  useEffect(() => {
    if (!league.official_league_id) {
      setLive(false);
      return;
    }

    const fixtures = getGamesByCompetitionId(league.official_league_id) || [];
    
    if (fixtures.length === 0) {
      setLive(false);
      return;
    }

    const roundFixtures = getRoundFixtures(
      fixtures,
      league.start_round ?? 0,
      league.end_round ?? 0
    );

    const lastMatch = roundFixtures[roundFixtures.length - 1];
    if (!lastMatch?.kickoff_time) {
      setLive(false);
      return;
    }

    const lastMatchDate = new Date(lastMatch.kickoff_time);
    const now = new Date();
    const diff = now.valueOf() - lastMatchDate.valueOf();
    const threeHours = 1000 * 60 * 60 * 3;
    
    // League is live if the difference between match and now is under 3 hours
    setLive(diff <= threeHours && isLocked);
  }, [league, getGamesByCompetitionId]);

  if (!isLive) return;

  return (
    <div
      className={twMerge(
        'w-[7px] h-[7px] rounded-full animate-pulse bg-red-600 dark:bg-red-500',
        className
      )}
    ></div>
  );
}
