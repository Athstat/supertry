import { ISbrFixture } from "../types/sbr";

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