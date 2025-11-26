import { addDays, addHours, addMinutes, subDays, subHours, subMinutes } from "date-fns";
import { isLeagueLocked } from "../../src/utils/leaguesUtils";

test('test is league locked when join deadline has passed', () => {
    const now = new Date();
    const joinDeadline1 = subHours(now, 1);
    const joinDeadline2 = subMinutes(now, 30);
    const joinDeadline3 = subDays(now, 1);
    const joinDeadline4 = subDays(now, 2);

    expect(isLeagueLocked(joinDeadline1)).toEqual(true);
    expect(isLeagueLocked(joinDeadline2)).toEqual(true);
    expect(isLeagueLocked(joinDeadline3)).toEqual(true);
    expect(isLeagueLocked(joinDeadline4)).toEqual(true);
});

test('test is league locked when join deadline has not yet been reached', () => {

    const now = new Date();
    const joinDeadline1 = addMinutes(now, 1);
    const joinDeadline2 = addMinutes(now, 30);
    const joinDeadline3 = addHours(now, 1);
    const joinDeadline4 = addDays(now, 2);

    expect(isLeagueLocked(joinDeadline1)).toEqual(false);
    expect(isLeagueLocked(joinDeadline2)).toEqual(false);
    expect(isLeagueLocked(joinDeadline3)).toEqual(false);
    expect(isLeagueLocked(joinDeadline4)).toEqual(false);

});

test('test is league locked when join deadline is equal to now', () => {

    const now = new Date();
    const joinDeadline = now;

    expect(isLeagueLocked(joinDeadline)).toEqual(true);

});


