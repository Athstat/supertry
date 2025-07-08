import { IFixture } from "../types/games";
import { IProMotmVote } from "../types/proMotm";

/** Returns true if MOTM voting has ended based on the given kick off time (3 hours after kickoff) */
export function hasProMotmVotingEnded(kickOffTime?: Date, now?: Date) {
    if (!kickOffTime) {
        return false;
    }

    kickOffTime = new Date(kickOffTime);
    now = now ? new Date(now) : new Date();

    // Voting window is 3 hours after kickoff
    const votingWindow = 1000 * 60 * 60 * 3;
    const votingExpectedEndEpoch = kickOffTime.valueOf() + votingWindow;
    const nowEpoch = now.valueOf();

    return nowEpoch >= votingExpectedEndEpoch;
}

/** Returns true if MOTM voting has started (after kickoff) */
export function hasProMotmVotingStarted(kickoff?: Date, now?: Date) {
    if (!kickoff) {
        return true;
    }

    kickoff = new Date(kickoff);
    now = now ? new Date(now) : new Date();

    const kickoffEpoch = kickoff.valueOf();
    const nowEpoch = now.valueOf();

    return nowEpoch >= kickoffEpoch;
}

/** Returns the total number of votes that an athlete received from a list of votes */
export function getProAthleteMotmVoteTally(votes: IProMotmVote[], athleteId: string) {
    const res = votes.reduce((sum, v) => {
        const isCandidate = v.athlete_id === athleteId;
        return isCandidate ? (sum + 1) : sum;
    }, 0);

    return res;
}

/** Returns fixture summary with game status information */
export function proFixtureSummary(fixture: IFixture) {
    const { team_score, opposition_score } = fixture;
    const hasScores = team_score !== null && opposition_score !== null && team_score !== undefined && opposition_score !== undefined;
    const homeTeamWon = hasScores ? team_score > opposition_score : false;
    const awayTeamWon = hasScores ? opposition_score > team_score : false;

    const now = new Date();
    const kickoff = fixture.kickoff_time;

    let hasKickedOff = false;

    if (kickoff) {
        const kickOffLocal = new Date(kickoff);
        const kickOffEpoch = kickOffLocal.valueOf();
        const nowEpoch = now.valueOf();
        hasKickedOff = nowEpoch >= kickOffEpoch;
    }

    return { homeTeamWon, awayTeamWon, team_score, opposition_score, hasScores, hasKickedOff };
}
