import { endOfDay, startOfDay } from "date-fns";
import { IFixture } from "../types/games";
import { ISbrFixture } from "../types/sbr";

export function fixtureSumary(fixture: IFixture) {
    const { team_score, kickoff_time, game_status, opposition_score } = fixture;

    const matchFinal = game_status === "completed" && team_score !== undefined && opposition_score !== undefined;
    const hasNotStarted = game_status === 'fixture';

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const gameKickedOff = kickoff_time !== undefined && (new Date(kickoff_time) < new Date());
    
    return {gameKickedOff, homeTeamWon, awayTeamWon, game_status, hasNotStarted, matchFinal};
}

export function summerizeGameStatus(fixture: IFixture) {
    const status = fixture.game_status;

    if (status) {
        if (status === "completed") return "Final";
        if (status === "in_progress") return "Live";
    }

    return "";
}

export function searchFixturesPredicate(fixture: IFixture ,query: string | undefined) {

    if (query === "" || query === undefined) return true;

    const {team, opposition_team} = fixture;

    if (!team || !opposition_team) return false;

    let match = false;

    const phrases = [
        `${team.athstat_name} vs ${opposition_team.athstat_name}`,
        `${opposition_team.athstat_name} vs ${team.athstat_name}`,
    ];

    phrases.forEach((phrase: string) => {

        if (phrase === "") return false;
         
        phrase = phrase.toLowerCase();

        const flag = phrase.startsWith(query);

        match = match || flag;
    });


    return match;

}

export function searchSbrFixturesPredicate(fixture: ISbrFixture ,query: string | undefined) {

    if (query === "" || query === undefined) return true;

    let match = false;

    const phrases = [
        `${fixture.home_team} vs ${fixture.away_team}`,
        `${fixture.away_team} vs ${fixture.home_team}`,
    ];

    phrases.forEach((phrase: string) => {

        if (phrase === "") return false;
         
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
    const filteredFixtures = fixtures.filter((f) => {
        return f.round >= start && f.round <= end;
    }).sort((a, b) => {
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
    
    return fixtures.filter((f) => {
      if (f.kickoff_time) {
        return (f.game_status === "complete");
      }

      return false;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() -
          new Date(b.kickoff_time).valueOf()
        : 0
    )
    .reverse()
    .splice(0, limit ?? 30)
    .reverse();

}


export function filterUpcomingFixtures(fixtures: IFixture[], limit?: number) {
    
    const dateNow = new Date();
    
    return fixtures.filter((f) => {
      if (f.kickoff_time) {
        return new Date(f.kickoff_time).valueOf() > dateNow.valueOf();
      }

      return false;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() -
          new Date(b.kickoff_time).valueOf()
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

    return fixtures.filter((f) => {
        if (f.kickoff_time) {
            const kickOff = new Date(f.kickoff_time);
            const kickOffEpoch = kickOff.valueOf();

            return kickOffEpoch >= firstEpoch &&  kickOffEpoch <= lastEpoch;
        }

        return false;
    })

}

export function searchProFixturePredicate(search: string, fixture: IFixture) : boolean {
    /** Returns true if a fixture meets the predicate given the search */
    // use things like, team name, venue, date, competition name, case insensitive

    if (!search || search.trim() === "") return true;
    const {team, opposition_team} = fixture;

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
    if (lowerSearch.includes(" vs ") || lowerSearch.includes(" VS ")) {
        const [team1, team2] = lowerSearch
            .replace(" VS ", " vs ")
            .split(" vs ")
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
        if (
            lowerSearch === teamVsOpp ||
            lowerSearch === oppVsTeam
        ) {
            return true;
        }
    }

    // Add "Shortened" versions: last word of each team name (e.g., "Bulls vs Sharks")
    const getShortName = (name?: string) =>
        name ? name.split(" ").slice(-1)[0] : undefined;

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
    return fields.some(field =>
        field ? field.toLowerCase().includes(lowerSearch) : false
    );

}

export function isProGameTBD(fixture: IFixture) {
    const {team, opposition_team} = fixture;

    if (!team || !opposition_team) return true;

    return team.athstat_name === 'TBD' || opposition_team.athstat_name === 'TBD';
}