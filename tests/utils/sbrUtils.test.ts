/** Sbr utils tests */
import { add } from "date-fns";
import { hasMotmVotingEnded } from "../../src/utils/sbrUtils";

test('hasMotmVotingEnded returns true when extactly two hours after kickoff', () => {
    const kickoff = new Date('2025-01-01T15:00Z');
    const now = add(kickoff, {
        hours: 2
    });

    expect(hasMotmVotingEnded(kickoff, now)).toStrictEqual(true);
});

test('hasMotmVotingEnded returns true when more than two hours after kickoff', () => {
    const kickoff = new Date('2025-01-01T15:00Z');
    const now = add(kickoff, {
        hours: 2,
        minutes: 1
    });

    expect(hasMotmVotingEnded(kickoff, now)).toStrictEqual(true);

    const kickoff2 = new Date('2025-01-01T15:00Z');
    const now2 = add(kickoff, {
        hours: 3,
        minutes: 30
    });

    expect(hasMotmVotingEnded(kickoff2, now2)).toStrictEqual(true);
});

test('hasMotmVotingEnded returns false when exactly 1 hour 59 minutes after kick off', () => {
    const kickoff = new Date('2025-01-01T15:00Z');
    const now = add(kickoff, {
        hours: 1,
        minutes: 59
    });

    expect(hasMotmVotingEnded(kickoff, now)).toStrictEqual(false);
});

test('hasMotmVotingEnded returns false when less than 2 hours after kick off', () => {
    const kickoff = new Date('2025-01-01T15:00Z');
    const now = add(kickoff, {
        hours: 1,
        minutes: 30
    });

    expect(hasMotmVotingEnded(kickoff, now)).toStrictEqual(false);

    const kickoff2 = new Date('2025-01-01T15:00Z');
    const now2 = add(kickoff, {
        minutes: 30
    });

    expect(hasMotmVotingEnded(kickoff2, now2)).toStrictEqual(false);
});