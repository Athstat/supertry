import { IFantasyLeagueRound } from '../types/fantasyLeague';
import { leagueService } from '../services/leagueService';
import { dateComparator } from './dateUtils';
import { FantasyLeagueGroup } from '../types/fantasyLeagueGroups';

/** Filters to only remain with leagues that seven days away */
export function activeLeaguesFilter(leagues: FantasyLeagueGroup[]) {
  return leagues
    .filter(l => {
      return l.is_hidden === false;
    })
    .sort((a, b) => {
      const aEndDate = new Date(a.end_date ?? 0);
      const bEndDate = new Date(b.end_date ?? 0);

      return aEndDate.valueOf() - bEndDate.valueOf();
    });
}

export function isLeagueOnTheClock(league: IFantasyLeagueRound, targetDiff: number) {
  const { join_deadline } = league;

  if (!join_deadline) return false;

  const today = new Date();
  const deadline = new Date(join_deadline);

  const diff = deadline.valueOf() - today.valueOf();

  return diff >= 0 && diff <= targetDiff;
}

/**
 * Fetches the latest active official league
 * @returns Promise with the latest official league or null if none found
 */
export async function getLatestOfficialLeague(): Promise<IFantasyLeagueRound | null> {
  try {
    // Fetch all leagues
    const allLeagues = await leagueService.getAllLeagues();
    // Filter for official leagues that are open or current
    const officialLeagues = allLeagues.filter(
      league =>
        league.type === 'official' && (league.status === 'open' || league.status === 'current')
    );

    if (officialLeagues.length === 0) {
      console.error('No active official leagues found');
      return null;
    }

    // Sort by created date descending (newest first)
    const sortedLeagues = officialLeagues.sort((a, b) => {
      const dateA = new Date(a.created_date || 0);
      const dateB = new Date(b.created_date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Return the most recent one
    return sortedLeagues[0];
  } catch (error) {
    console.error('Error fetching latest official league:', error);
    return null;
  }
}

/** Renders a component to show the change in rank for a league */
export function getRankChange(currentRank: number, lastRank: number) {
  if (currentRank < lastRank) {
    return <span className="text-green-500">↑</span>;
  } else if (currentRank > lastRank) {
    return <span className="text-red-500">↓</span>;
  }
  return null;
}

/** Returns true if a league has passed its join dealine and can't have teams added to it */
export function isLeagueLocked(joinDeadline: Date | null | undefined) {
  if (!joinDeadline) return false;

  const now = new Date();
  const deadline = new Date(joinDeadline);

  return now.valueOf() > deadline.valueOf();
}

export function isLeagueRoundLocked(leagueRound: IFantasyLeagueRound) {
  const { join_deadline } = leagueRound;

  if (!join_deadline) return false;

  const now = new Date();
  const deadline = new Date(join_deadline);

  return now.valueOf() >= deadline.valueOf();
}

export function hasLeagueRoundEnded(leagueRound: IFantasyLeagueRound) {
  const { has_ended } = leagueRound;

  return has_ended;
}

export function isLeagueGroupLocked(joinDeadline: Date | null | undefined) {
  if (!joinDeadline) return false;

  const now = new Date();
  const deadline = new Date(joinDeadline);

  return now.valueOf() > deadline.valueOf();
}

/** Returns the last possible date that users can join a league */
export function calculateJoinDeadline(league: IFantasyLeagueRound) {
  if (league.join_deadline) {
    const deadline = new Date(league.join_deadline);
    return deadline;
  }

  return undefined;
}

/** Returns a bias that can be used to sort locked leagues and unclocked leagues */
export function leagueLockBias(a: IFantasyLeagueRound) {
  const isLocked = isLeagueLocked(a.join_deadline);
  return isLocked ? 0 : 1;
}

/** Gets the latest league for user to create team for */
export async function latestLeagueFetcher() {
  const leagues = await leagueService.getAllLeagues();

  const sortedLeagues = leagues
    .filter(l => {
      const deadline = calculateJoinDeadline(l);

      if (!deadline) {
        return false;
      }

      const now = new Date();
      const deadlineEpoch = deadline.valueOf();

      const tolleranceDiff = 1000 * 60 * 60 * 24 * 3;

      const pivot = now.valueOf() - tolleranceDiff;

      return deadlineEpoch > pivot;
    })
    .sort((a, b) => dateComparator(a.join_deadline, b.join_deadline));

  if (sortedLeagues.length === 0) return undefined;
  return sortedLeagues[0];
}

/** Upcoming Leagues Filter, returns leagues that are more than 7 days away */
export function upcomingLeaguesFilter(leagues: IFantasyLeagueRound[]) {
  return leagues
    .filter(l => {
      if (!l.join_deadline) {
        return false;
      }

      const today = new Date();
      const deadline = new Date(l.join_deadline);
      const diffEpoch = deadline.valueOf() - today.valueOf();
      const fiveDayEpoch = 1000 * 60 * 60 * 24 * 5;

      return diffEpoch > fiveDayEpoch;
    })
    .sort((a, b) => {
      const aDeadline = new Date(a.join_deadline ?? 0);
      const bDealine = new Date(b.join_deadline ?? 0);

      return aDeadline.valueOf() - bDealine.valueOf();
    });
}

/** Returns a list of leagues that have ended */
export function pastLeaguesFilter(leagues: IFantasyLeagueRound[]) {
  return leagues
    .filter(l => {
      return l.has_ended === true;
    })
    .sort((a, b) => {
      const aDeadline = new Date(a.join_deadline ?? 0);
      const bDeadline = new Date(b.join_deadline ?? 0);

      return bDeadline.valueOf() - aDeadline.valueOf();
    });
}

/** Filters leagues and returns leagues that are on the clock (7 days away) */
export function leaguesOnClockFilter(leagues: FantasyLeagueGroup[]) {
  const activeLeagues = activeLeaguesFilter(leagues);

  const leagueOnTheClock = activeLeagues.length > 0 ? activeLeagues[0] : undefined;

  return {
    leaguesOnTheClock: activeLeagues,
    firstLeagueOnClock: leagueOnTheClock,
  };
}
