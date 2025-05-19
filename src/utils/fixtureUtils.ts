import { endOfDay, startOfDay } from "date-fns";
import { IFixture } from "../types/games";
import { ISbrFixture } from "../types/sbr";

export function fixtureSumary(fixture: IFixture) {
    const { team_score, kickoff_time, game_status, opposition_score } = fixture;

    const matchFinal = game_status === "completed" && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const gameKickedOff = kickoff_time && (new Date(kickoff_time) < new Date());
    
    return {gameKickedOff, homeTeamWon, awayTeamWon, game_status};
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

    let match = false;

    const phrases = [
        `${fixture.team_name} vs ${fixture.opposition_team_name}`,
        `${fixture.opposition_team_name} vs ${fixture.team_name}`,
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
    
    const dateNow = new Date();
    
    return fixtures.filter((f) => {
      if (f.kickoff_time) {
        return (
          f.game_status === "complete" ||
          new Date(f.kickoff_time).valueOf() < dateNow.valueOf()
        );
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