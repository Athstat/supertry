import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { isSeasonRoundStarted } from "../leaguesUtils";

function sortSeasonRounds(seasonRounds: ISeasonRound[]) {
    return [...seasonRounds].sort((a, b) => {
        return (a.round_number || 0) - (b.round_number || 0);
    })
}

/** Function that gets the current season round, using the following conditions.
 * 1. If none of the rounds of started, it returns the first round as the current round
 * 2. If the rounds are currently running it returns the round after the just ended round
 * 3. If all rounds have been completed it returns the last round as the current round
 */
export function getCurrentRound(seasonRounds: ISeasonRound[]) {
    const now = new Date();

    if (seasonRounds.length === 0) {
        return undefined;
    }

    seasonRounds = sortSeasonRounds(seasonRounds);

    const endedRoundsDesc = seasonRounds.filter((r) => {
        if (!r.games_end) return false;
        const gameHaveEnded = new Date(r.games_end);
        return now.valueOf() > gameHaveEnded.valueOf();
    }).sort((a, b) => {
        const aGameEnd = new Date(a.games_end || new Date());
        const bGameEnd = new Date(b.games_end || new Date());

        return bGameEnd.valueOf() - aGameEnd.valueOf();
    });

    if (endedRoundsDesc.length === 0) {
        return seasonRounds[0];
    }

    const lastRound = endedRoundsDesc[0];
    if (!lastRound || !lastRound.round_number) {
        return seasonRounds[0]
    }

    const nextRoundFromLast = seasonRounds.find((r) => r.round_number === lastRound.round_number + 1);
    if (nextRoundFromLast) {
        return nextRoundFromLast;
    }

    return lastRound;
}

/** Function that gets the previous round, by moving an index back from the current round */
export function getPreviousRound(seasonRounds: ISeasonRound[]) {
    const currentRound = getCurrentRound(seasonRounds);

    if (currentRound) {
        const prev = seasonRounds.find((r) => {
            const prevIndex = ((currentRound.round_number || 0) - 1);
            return r.round_number === prevIndex;
        });

        return prev;
    }

    return undefined;
}

/** Function that gets the current scoring round in which points should
 * be displayed for, using the following conditions.
 * 1.  If the current round is live/isLocked, return the current round as it is the one being scored for
 * 2.1 If the the current round has not yet started (isNotLocked) return previous round as scoring round
 * 2.2 if previous round is undefined return undefined */
export function getScoringRound(seasonRounds: ISeasonRound[]) {
    const currentRound = getCurrentRound(seasonRounds);

    if (!currentRound) {
        return undefined;
    }

    if (isSeasonRoundStarted(currentRound)) {
        return currentRound;
    }

    return getPreviousRound(seasonRounds);
}