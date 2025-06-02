import { isWithinInterval } from "date-fns";
import { ISbrFixture } from "../types/sbr";
import { getNextDayOfWeek, getPreviousDayOfWeek } from "./dateUtils";

/** Returns true if all the fixtures passed to the funciton have
 * passed
 */

export function hasSbrRoundPassed(fixtures: ISbrFixture[]) {
    const fixturesDesc = fixtures.sort((a, b) => {
        const aKickoff = new Date(a.kickoff_time ?? new Date());
        const bKickoff = new Date(b.kickoff_time ?? new Date());

        return bKickoff.valueOf() - aKickoff.valueOf();
    });

    const lastFixture = fixturesDesc.length > 0 ?
        fixturesDesc[0] : undefined;

    const now = new Date();

    if (lastFixture && lastFixture.kickoff_time) {
        const lastKickoff = new Date(lastFixture.kickoff_time ?? new Date());
        return now.valueOf() > lastKickoff.valueOf();
    }

    return false;
}

export function sbrFxitureSummary(fixture: ISbrFixture) {

    const { home_score, away_score } = fixture;
    const hasScores = home_score !== null && away_score !== null && home_score !== undefined && away_score !== undefined;
    const homeTeamWon = hasScores ?
        home_score > away_score : false;

    const awayTeamWon = hasScores ?
        away_score > home_score : false;

    return { homeTeamWon, awayTeamWon, home_score, away_score, hasScores }
}

export function getSbrSeasons(fixtures: ISbrFixture[]) {
    const seasons: string[] = [];

    fixtures.forEach((f) => {
        if (f.season) {

            if (!seasons.includes(f.season)) {
                seasons.push(f.season);
            }
        }
    });

    return seasons;
}

export function getNextWednesdayIfNotWednesday(pivot: Date) {
    if (pivot.getDay() === 3) {
        return pivot;
    }
    return getNextDayOfWeek(pivot, 'Wednesday');
}

export function getLastThursdayIfNotThruday(pivot: Date) {
    
    if (pivot.getDay() === 4) {
        return pivot;
    }

    return getPreviousDayOfWeek(pivot, 'Thursday');
}

export function getWeekGames(fixtures: ISbrFixture[], pivot?: Date) {
    
    const today = pivot ? new Date(pivot) : new Date() ;
    const weeekStart = getLastThursdayIfNotThruday(today);
    const weekEnd = getNextWednesdayIfNotWednesday(today);

    const weekGames = fixtures.filter((f) => {
        if (f.kickoff_time) {
            
            const kickoff = new Date(f.kickoff_time) 
            
            return isWithinInterval(kickoff, {
                start: weeekStart,
                end: weekEnd
            });
        }

        return false;
    });

    return {weekGames, weeekStart, weekEnd};

}