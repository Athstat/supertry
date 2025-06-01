import {getNextDayOfTheWeek} from "../../src/utils/dateUtils";

test('next day of the week date, when next day is ahead of pivot', () => {
    const pivot = new Date('2025-06-01'); // Sunday 01 June 2025
    const expected = new Date('2025-06-05'); // Thursday 05 June 2025

    expect(getNextDayOfTheWeek(pivot, 'Thursday')).toStrictEqual(expected);
});

test('next day of the week date, when next day is behind pivot', () => {
    const pivot = new Date('2025-06-13'); // Friday 13 June 2025
    const expected = new Date('2025-06-17'); // Tuesday 17 June 2025

    expect(getNextDayOfTheWeek(pivot, 'Tuesday')).toStrictEqual(expected);
});

test('next day of the week date, when next day is same as pivot', () => {
    const pivot = new Date('2025-06-25'); // Wednesday 25 June 2025
    const expected = new Date('2025-07-02'); // Wednesday 02 July 2025

    expect(getNextDayOfTheWeek(pivot, 'Wednesday')).toStrictEqual(expected);
});

test('next day of the week date, when next day is just a day after pivot', () => {
    const pivot = new Date('2025-06-25'); // Wednesday 25 June 2025
    const expected = new Date('2025-06-26'); // Thurday 26 June 2025

    expect(getNextDayOfTheWeek(pivot, 'Thursday')).toStrictEqual(expected);
});