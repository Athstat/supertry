import { add, addDays, addHours, addMinutes } from "date-fns";
import { isLeagueLocked } from "../../src/utils/leaguesUtils";

test('test is league locked when join deadline has passed', () => {
    const now = new Date();
    const joinDeadline = addDays(now, 1);

    expect(isLeagueLocked(joinDeadline)).toEqual(true);
});

test('test is league locked when join deadline in equal to time now', () => {
    // This problem is something we eventually want to fix, but this test
    // serves to make sure the work around isn't broken
    // sincerely Tadiwa

    /** 
        The Problem here is that the join deadline is actually set two hours
        before the game on the backend but on the front-end we lock the leagues
        30 minutes before the first match
    */

    const now = new Date();
    const joinDeadline = addMinutes(now, 1);

    expect(isLeagueLocked(joinDeadline)).toEqual(false);

});

test('test is league locked when its 30 minutes before the first match', () => {
    // This problem is something we eventually want to fix, but this test
    // serves to make sure the work around isn't broken
    // sincerely Tadiwa

    /** 
        The Problem here is that the join deadline is actually set two hours
        before the game on the backend but on the front-end we lock the leagues
        30 minutes before the first match
    */

    const now = new Date();
    const joinDeadline = add(now, {
        minutes: 30,
        hours: 1
    });

    expect(isLeagueLocked(joinDeadline)).toEqual(true);

});

