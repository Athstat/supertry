import { endOfDay, startOfDay, startOfWeek, endOfWeek, getWeek, getYear, format, addDays, subDays } from 'date-fns';
import { BaseFixture, GameKeyEvent, GameKeyEventAction, IFixture } from '../types/games';
import { ISbrFixture } from '../types/sbr';
import { IProAthlete } from '../types/athletes';
import { SortDirection } from '../types/playerSorting';
import { IProTeam } from '../types/team';

export function fixtureSummary(fixture: IFixture) {
  const { team_score, kickoff_time, game_status, opposition_score } = fixture;

  const matchFinal =
    (game_status === 'completed' || game_status === 'result') &&
    team_score !== undefined &&
    opposition_score !== undefined;

  const hasNotStarted = game_status === "not_started";

  const homeTeamWon = matchFinal ? team_score > opposition_score : false;
  const awayTeamWon = matchFinal ? team_score < opposition_score : false;
  const isDraw = matchFinal ? (team_score ?? 0) === (opposition_score ?? 0) : false;

  const gameKickedOff =
    kickoff_time !== undefined && new Date(kickoff_time) < new Date() && game_status !== 'fixture';

  return { gameKickedOff, homeTeamWon, awayTeamWon, game_status, hasNotStarted, matchFinal, isDraw };
}

export function summerizeGameStatus(fixture: IFixture) {
  const status = fixture.game_status;

  if (status) {
    if (status === 'completed') return 'Final';
    if (status === 'in_progress') return 'Live';
  }

  return '';
}

export function searchFixturesPredicate(fixture: IFixture, query: string | undefined) {
  if (query === '' || query === undefined) return true;

  const { team, opposition_team } = fixture;

  if (!team || !opposition_team) return false;

  let match = false;

  const phrases = [
    `${team.athstat_name} vs ${opposition_team.athstat_name}`,
    `${opposition_team.athstat_name} vs ${team.athstat_name}`,
  ];

  phrases.forEach((phrase: string) => {
    if (phrase === '') return false;

    phrase = phrase.toLowerCase();

    const flag = phrase.startsWith(query);

    match = match || flag;
  });

  return match;
}

export function searchSbrFixturesPredicate(fixture: ISbrFixture, query: string | undefined) {
  if (query === '' || query === undefined) return true;

  let match = false;

  const phrases = [
    `${fixture.home_team} vs ${fixture.away_team}`,
    `${fixture.away_team} vs ${fixture.home_team}`,
  ];

  phrases.forEach((phrase: string) => {
    if (phrase === '') return false;

    phrase = phrase.toLowerCase();

    const flag = phrase.startsWith(query);

    match = match || flag;
  });

  return match;
}

/** Filters fixtures to only show those belonging to a certain round
 * and returns in ascending order of date
 */
export function getRoundFixtures(fixtures: IFixture[], start: number, end: number) {
  const filteredFixtures = fixtures
    .filter(f => {
      return f.round >= start && f.round <= end;
    })
    .sort((a, b) => {
      const aDate = new Date(a.kickoff_time ?? new Date());
      const bDate = new Date(b.kickoff_time ?? new Date());

      return aDate.valueOf() - bDate.valueOf();
    });

  return filteredFixtures;
}

export function calculatePerc(val: number, total: number) {
  if (val === 0 || total === 0) return 0;
  return Math.floor((val / total) * 100);
}

export function createEmptyArray<T>(size: number, initVal: T): T[] {
  const arr: T[] = [];

  for (let x = 0; x < size; x++) {
    arr.push(initVal);
  }

  return arr;
}

export function filterPastFixtures(fixtures: IFixture[], limit?: number) {
  return fixtures
    .filter(f => {
      if (f.kickoff_time) {
        return f.game_status === "completed";
      }

      return false;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf()
        : 0
    )
    .reverse()
    .splice(0, limit ?? 30)
    .reverse();
}

export function filterUpcomingFixtures(fixtures: IFixture[], limit?: number) {
  const dateNow = new Date();

  return fixtures
    .filter(f => {
      if (f.kickoff_time) {
        return new Date(f.kickoff_time).valueOf() > dateNow.valueOf();
      }

      return false;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf()
        : 0
    )
    .splice(0, limit ?? 20);
}

/** Filters fixtures and returns fixtures that are with in a date range */
export function filterFixturesByDateRange(fixtures: IFixture[], dateRange: Date[]) {
  if (dateRange.length < 1) {
    return [];
  }

  const firstDate = startOfDay(new Date(dateRange[0]));
  const firstEpoch = firstDate.valueOf();
  const lastDate = endOfDay(new Date(dateRange[dateRange.length - 1]));
  const lastEpoch = lastDate.valueOf();

  return fixtures.filter(f => {
    if (f.kickoff_time) {
      const kickOff = new Date(f.kickoff_time);
      const kickOffEpoch = kickOff.valueOf();

      return kickOffEpoch >= firstEpoch && kickOffEpoch <= lastEpoch;
    }

    return false;
  });
}

export function searchProFixturePredicate(search: string, fixture: IFixture): boolean {
  /** Returns true if a fixture meets the predicate given the search */
  // use things like, team name, venue, date, competition name, case insensitive

  if (!search || search.trim() === '') return true;
  const { team, opposition_team } = fixture;

  if (!team || !opposition_team) return false;

  const lowerSearch = search.toLowerCase().trim();

  // Collect searchable fields
  const fields: (string | undefined)[] = [
    team.athstat_name,
    opposition_team.athstat_name,
    fixture.venue,
    fixture.competition_name,
    fixture.kickoff_time ? new Date(fixture.kickoff_time).toLocaleDateString() : undefined,
    fixture.kickoff_time ? new Date(fixture.kickoff_time).toLocaleTimeString() : undefined,
  ];

  // Also add "Team vs Opposition" and "Opposition vs Team"
  // Add "Team vs Opposition" and "Opposition vs Team" (full names)
  fields.push(
    team.athstat_name && opposition_team.athstat_name
      ? `${team.athstat_name} vs ${opposition_team.athstat_name}`
      : undefined
  );
  // Add both "Team vs Opposition" and "Opposition vs Team" (full names, both orders)
  if (team.athstat_name && opposition_team.athstat_name) {
    fields.push(`${team.athstat_name} vs ${opposition_team.athstat_name}`);
    fields.push(`${opposition_team.athstat_name} vs ${team.athstat_name}`);
  }
  // Special handling for "vs" searches: allow partial team name matches in either order
  if (lowerSearch.includes(' vs ') || lowerSearch.includes(' VS ')) {
    const [team1, team2] = lowerSearch
      .replace(' VS ', ' vs ')
      .split(' vs ')
      .map(s => s.trim());
    // Allow partial team name matches in either order using includes
    if (team1 && team2 && team.athstat_name && opposition_team.athstat_name) {
      const home = team.athstat_name.toLowerCase();
      const away = opposition_team.athstat_name.toLowerCase();

      if (
        (home.includes(team1) && away.includes(team2)) ||
        (away.includes(team1) && home.includes(team2))
      ) {
        return true;
      }
    }
    if (team1 && team2 && team.athstat_name && opposition_team.athstat_name) {
      const home = team.athstat_name.toLowerCase();
      const away = opposition_team.athstat_name.toLowerCase();

      if (
        (home.startsWith(team1) && away.startsWith(team2)) ||
        (away.startsWith(team1) && home.startsWith(team2))
      ) {
        return true;
      }
    }
  }
  // Add reversed "Team vs Opposition" and "Opposition vs Team" for matching both orders
  if (team.athstat_name && opposition_team.athstat_name) {
    const teamVsOpp = `${team.athstat_name} vs ${opposition_team.athstat_name}`.toLowerCase();
    const oppVsTeam = `${opposition_team.athstat_name} vs ${team.athstat_name}`.toLowerCase();
    if (lowerSearch === teamVsOpp || lowerSearch === oppVsTeam) {
      return true;
    }
  }

  // Add "Shortened" versions: last word of each team name (e.g., "Bulls vs Sharks")
  const getShortName = (name?: string) => (name ? name.split(' ').slice(-1)[0] : undefined);

  const shortTeam = getShortName(team.athstat_name);
  const shortOpposition = getShortName(opposition_team.athstat_name);

  if (shortTeam && shortOpposition) {
    fields.push(`${shortTeam} vs ${shortOpposition}`);
    fields.push(`${shortOpposition} vs ${shortTeam}`);
  }
  fields.push(
    opposition_team.athstat_name && team.athstat_name
      ? `${opposition_team.athstat_name} vs ${team.athstat_name}`
      : undefined
  );

  // Check if any field contains the search string
  return fields.some(field => (field ? field.toLowerCase().includes(lowerSearch) : false));
}

export function isProGameTBD(fixture: IFixture) {
  const { team, opposition_team } = fixture;

  if (!team || !opposition_team) return true;

  return team.athstat_name === 'TBD' || opposition_team.athstat_name === 'TBD';
}

/** Returns true if a match is a past fixture */
export function isPastFixture(fixture?: IFixture): boolean {
  if (!fixture) {
    return false;
  }

  const { kickoff_time } = fixture;

  if (kickoff_time) {
    const nowEpoch = new Date().valueOf();
    const gameEndEpoch = new Date(kickoff_time).valueOf() + 3 * 60 * 60 * 1000;
    return nowEpoch > gameEndEpoch;
  }

  return false;
}

/** Checks if a game is currently live based on its status */
export function isGameLive(gameStatus?: string): boolean {
  if (!gameStatus) return false;

  const nonLiveStatuses = ['Team in', 'Fulltime', 'not_started', 'completed', 'fixture', 'result'];
  return !nonLiveStatuses.includes(gameStatus);
}

/** Formats game status for display (converts to uppercase) */
export function formatGameStatus(gameStatus?: string): string {
  if (!gameStatus) return '';
  return gameStatus.toUpperCase();
}

/** Get ISO week number from a date */
export function getWeekNumber(date: Date): number {
  return getWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
}

/** Get the year for a given date (handles year transitions) */
export function getWeekYear(date: Date): number {
  return getYear(date);
}

/** Get current week number and year */
export function getCurrentWeek(): { weekNumber: number; year: number } {
  const now = new Date();
  return {
    weekNumber: getWeekNumber(now),
    year: getWeekYear(now),
  };
}

/** Get Monday-Sunday date range for a given week number and year */
export function getWeekDateRange(weekNumber: number, year: number): { start: Date; end: Date } {

  // Get the first day of week 1 in the target year
  const week1Start = startOfWeek(new Date(year, 0, 4), { weekStartsOn: 1 });

  // Calculate the start date by adding (weekNumber - 1) weeks
  const weekStart = new Date(week1Start);
  weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);

  // Get the start and end of the week
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const end = endOfWeek(weekStart, { weekStartsOn: 1 });

  return { start, end };
}

/** Format week header: "Week 45, 27 Oct - 2 Nov" */
export function formatWeekHeader(
  dateRange: { start: Date; end: Date }
): string {
  const startFormatted = format(dateRange.start, 'dd MMM');
  const endFormatted = format(dateRange.end, 'dd MMM');

  return `${startFormatted} - ${endFormatted}`;
}

/** Get fixtures for a specific week */
export function getFixturesForWeek(
  fixtures: BaseFixture[],
  weekStart: Date,
  weekEnd: Date,
  sortDirection: SortDirection = "asc"
): BaseFixture[] {

  return fixtures
    .filter((f) => {
      const kickoff = f.kickoff_time ? new Date(f.kickoff_time) : undefined;

      if (!kickoff) {
        return undefined;
      }

      return (kickoff.valueOf() >= weekStart.valueOf()) && (kickoff.valueOf() <= weekEnd.valueOf());
    }).sort((a, b) => {

      const aDate = new Date(a.kickoff_time ?? new Date());
      const bDate = new Date(b.kickoff_time ?? new Date());

      if (sortDirection === "asc") {
        return aDate.valueOf() - bDate.valueOf();
      }

      return bDate.valueOf() - aDate.valueOf(); // Sort descending (latest first)

    })
}

/** Get SBR fixtures for a specific week */
export function getSbrFixturesForWeek<T extends { kickoff_time?: Date }>(
  fixtures: T[],
  weekNumber: number,
  year: number
): T[] {
  const { start, end } = getWeekDateRange(weekNumber, year);
  const startEpoch = startOfDay(start).valueOf();
  const endEpoch = endOfDay(end).valueOf();

  return fixtures
    .filter(f => {
      if (f.kickoff_time) {
        const kickoffEpoch = new Date(f.kickoff_time).valueOf();
        return kickoffEpoch >= startEpoch && kickoffEpoch <= endEpoch;
      }
      return false;
    })
    .sort((a, b) => {
      const aDate = new Date(a.kickoff_time ?? new Date());
      const bDate = new Date(b.kickoff_time ?? new Date());
      return aDate.valueOf() - bDate.valueOf();
    });
}

/** Find the next week with fixtures (searches forward up to maxWeeks) */
export function findNextWeekPivotWithFixtures(fixtures: BaseFixture[], pivotDate: Date, maxWeeks: number = 12): Date | null {
  let currPivot = pivotDate || new Date();
  currPivot = addDays(currPivot, 7);

  for (let i = 0; i < maxWeeks; i++) {

    const weekStart = startOfWeek(currPivot);
    const weekEnd = endOfWeek(currPivot);

    // Check if this week has fixtures
    const weekFixtures = getFixturesForWeek(fixtures, weekStart, weekEnd);

    if (weekFixtures.length > 0) {
      return currPivot;
    }

    currPivot = addDays(currPivot, 7);
  }

  return null;
}

/** Find the next week with SBR fixtures (searches forward up to maxWeeks) */
export function findNextWeekWithSbrFixtures<T extends { kickoff_time?: Date }>(
  fixtures: T[],
  startWeek: number,
  startYear: number,
  maxWeeks: number = 12
): { weekNumber: number; year: number } | null {
  let currentWeek = startWeek;
  let currentYear = startYear;

  for (let i = 0; i < maxWeeks; i++) {
    // Move to next week
    if (currentWeek === 52) {
      currentWeek = 1;
      currentYear++;
    } else {
      currentWeek++;
    }

    // Check if this week has fixtures
    const weekFixtures = getSbrFixturesForWeek(fixtures, currentWeek, currentYear);
    if (weekFixtures.length > 0) {
      return { weekNumber: currentWeek, year: currentYear };
    }
  }

  return null;
}

/** Find the previous week pivot with fixtures (searches backward up to maxWeeks) */
export function findPreviousWeekPivotWithFixtures(fixtures: BaseFixture[], pivotDate: Date, maxWeeks: number = 26): Date | null {

  let currPivot = pivotDate || new Date();
  currPivot = subDays(currPivot, 7);

  for (let i = 0; i < maxWeeks; i++) {

    const weekStart = startOfWeek(currPivot);
    const weekEnd = endOfWeek(currPivot);

    // Check if this week has fixtures
    const weekFixtures = getFixturesForWeek(fixtures, weekStart, weekEnd);

    if (weekFixtures.length > 0) {
      return currPivot;
    }

    currPivot = subDays(currPivot, 7);
  }

  return null;
}

/** Find the previous week with SBR fixtures (searches backward up to maxWeeks) */
export function findPreviousWeekWithSbrFixtures<T extends { kickoff_time?: Date }>(
  fixtures: T[],
  startWeek: number,
  startYear: number,
  maxWeeks: number = 26
): { weekNumber: number; year: number } | null {
  let currentWeek = startWeek;
  let currentYear = startYear;

  for (let i = 0; i < maxWeeks; i++) {
    // Move to previous week
    if (currentWeek === 1) {
      currentWeek = 52;
      currentYear--;
    } else {
      currentWeek--;
    }

    // Check if this week has fixtures
    const weekFixtures = getSbrFixturesForWeek(fixtures, currentWeek, currentYear);
    if (weekFixtures.length > 0) {
      return { weekNumber: currentWeek, year: currentYear };
    }
  }

  return null;
}

/** Find the closest week with fixtures (checks current, then forward, then backward) */
export function findClosestWeekWithFixtures(
  fixtures: BaseFixture[],
  pivotDate: Date
): Date | null | undefined {

  const weekStart = startOfWeek(pivotDate ? new Date(pivotDate) : new Date());
  const weekEnd = endOfWeek(pivotDate ? new Date(pivotDate) : new Date());

  // First check if current week has fixtures
  const currentWeekFixtures = getFixturesForWeek(fixtures, weekStart, weekEnd);

  if (currentWeekFixtures.length > 0) {
    return pivotDate;
  }

  // Try finding next week with fixtures
  const nextWeekPivot = findNextWeekPivotWithFixtures(fixtures, pivotDate, 114);
  if (nextWeekPivot) {
    return nextWeekPivot;
  }

  // Fallback to previous week with fixtures
  const previousWeekPivot = findPreviousWeekPivotWithFixtures(fixtures, pivotDate, 114);
  if (previousWeekPivot) {
    return previousWeekPivot;
  }

  return null;
}

/** Find the closest week with SBR fixtures (checks current, then forward, then backward) */
export function findClosestWeekWithSbrFixtures<T extends { kickoff_time?: Date }>(
  fixtures: T[],
  startWeek: number,
  startYear: number
): { weekNumber: number; year: number } | null {
  // First check if current week has fixtures
  const currentWeekFixtures = getSbrFixturesForWeek(fixtures, startWeek, startYear);
  if (currentWeekFixtures.length > 0) {
    return { weekNumber: startWeek, year: startYear };
  }

  // Try finding next week with fixtures
  const nextWeek = findNextWeekWithSbrFixtures(fixtures, startWeek, startYear, 26);
  if (nextWeek) {
    return nextWeek;
  }

  // Fallback to previous week with fixtures
  const previousWeek = findPreviousWeekWithSbrFixtures(fixtures, startWeek, startYear, 26);
  if (previousWeek) {
    return previousWeek;
  }

  return null;
}


export function getOpponent(fixture: IFixture, player: IProAthlete, seasonTeam?: IProTeam) {
  const { team, opposition_team } = fixture;

  if (!team || !opposition_team || !team) {
    return undefined;
  }

  const teamId = seasonTeam?.athstat_id || player.team_id;

  const isHomePlayer = team.athstat_id === teamId;
  const isawayPlayer = opposition_team.athstat_id === teamId;

  if (isHomePlayer) {
    return opposition_team;
  }

  if (isawayPlayer) {
    return team;
  }

  return undefined;
}

export function getGameKeyEventName(action: GameKeyEventAction) : string {
  if (action === "TRY") {
    return "Try";
  }

  if (action === "CONV") {
    return "Conversion"
  }

  if (action === "YELC") {
    return "Yellow Card"
  }

  if (action === "PENK") {
    return "Penalty Kick"
  }

  return action
}

export function getPeriodMarkerName(event: GameKeyEvent) : string | undefined   {
  if (event.action === "START") {
    return event.period === "First Half" ? "Kick Off" : "Half Time"
  }

  if (event.action === "END") {
    return event.period === "First Half" ? undefined : "Full Time";
  }

  return undefined
}