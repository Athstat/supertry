import { isWithinInterval } from "date-fns";
import { ISbrFixture, ISbrFixtureVote, ISbrMotmVote } from "../types/sbr";
import { calculatePerc } from "./fixtureUtils";

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

export function sbrFixtureSummary(fixture: ISbrFixture) {

    const { home_score, away_score } = fixture;
    const hasScores = home_score !== null && away_score !== null && home_score !== undefined && away_score !== undefined;
    const homeTeamWon = hasScores ?
        home_score > away_score : false;

    const awayTeamWon = hasScores ?
        away_score > home_score : false;

    const now = new Date();
    const kickoff = fixture.kickoff_time;

    let hasKickedOff = false;

    if (kickoff) {
        const kickOffLocal = new Date(kickoff);

        const kickOffEpoch = kickOffLocal.valueOf();
        const nowEpoch = now.valueOf();

        hasKickedOff = nowEpoch >= kickOffEpoch;
    }

    return { homeTeamWon, awayTeamWon, home_score, away_score, hasScores, hasKickedOff }
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

/** Gets  */
export function filterSbrFixturesByDateRange(fixtures: ISbrFixture[], weekStart: Date, weekEnd: Date) {

    const weekGames = fixtures.filter((f) => {
        if (f.kickoff_time) {

            const kickoff = new Date(f.kickoff_time)

            return isWithinInterval(kickoff, {
                start: weekStart,
                end: weekEnd
            });
        }

        return false;
    });

    return weekGames

}

export function getSbrVotingSummary(fixture: ISbrFixture, userVote?: ISbrFixtureVote) {

    const homeVotes = Number.parseInt(fixture.home_votes.toString());
    const awayVotes = Number.parseInt(fixture.away_votes.toString());
    const total = homeVotes + awayVotes;
    const homePerc = calculatePerc(homeVotes, total);
    const awayPerc = calculatePerc(awayVotes, total);

    const votedHomeTeam = userVote?.vote_for === "home_team";
    const votedAwayTeam = userVote?.vote_for === "away_team";

    return {
        homePerc,
        awayPerc,
        votedAwayTeam,
        votedHomeTeam,
        homeVotes,
        awayVotes
    }
}

/** Returns true if motm voting has ended based on the given kick off time */
export function hasMotmVotingEnded(kickOffTime?: Date, now?: Date) {
    if (!kickOffTime) {
        return false;
    }

    kickOffTime = new Date(kickOffTime);
    now = now ? new Date(now) : new Date();

    // Voting window is two hours
    const votingWindow = 1000 * 60 * 60 * 2;
    const votingExpectedEndEpoch = kickOffTime.valueOf() + votingWindow;
    const nowEpoch = now.valueOf();

    return nowEpoch >= votingExpectedEndEpoch;
}

/** Returns the total number of votes that an athlete recieved from a list of votes */
export function getSbrAthleteMotmVoteTally(votes: ISbrMotmVote[], athleteId: string) {
    const res = votes.reduce((sum, v) => {
        const isCandidate = v.athlete_id === athleteId;
        return isCandidate ? (sum + 1) : sum;
    }, 0);

    return res;
}

export function hasMotmVotingStarted(kickoff?: Date, now?: Date) {
    if (!kickoff) {
        return true;
    }

    kickoff = new Date(kickoff);
    now = now ? new Date(now) : new Date();

    const kickoffEpoch = kickoff.valueOf();
    const nowEpoch = now.valueOf();

    return nowEpoch >= kickoffEpoch;

}
