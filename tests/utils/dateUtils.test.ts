import {getNextDayOfWeek, getPreviousDayOfWeek} from "../../src/utils/dateUtils";

test('next day of the week date, when next day is ahead of pivot', () => {
    const pivot = new Date('2025-06-01'); // Sunday 01 June 2025
    const expected = new Date('2025-06-05'); // Thursday 05 June 2025

    expect(getNextDayOfWeek(pivot, 'Thursday')).toStrictEqual(expected);
});

test('next day of the week date, when next day is behind pivot', () => {
    const pivot = new Date('2025-06-13'); // Friday 13 June 2025
    const expected = new Date('2025-06-17'); // Tuesday 17 June 2025

    expect(getNextDayOfWeek(pivot, 'Tuesday')).toStrictEqual(expected);
});

test('next day of the week date, when next day is same as pivot', () => {
    const pivot = new Date('2025-06-25'); // Wednesday 25 June 2025
    const expected = new Date('2025-07-02'); // Wednesday 02 July 2025

    expect(getNextDayOfWeek(pivot, 'Wednesday')).toStrictEqual(expected);
});

test('next day of the week date, when next day is just a day after pivot', () => {
    const pivot = new Date('2025-06-25'); // Wednesday 25 June 2025
    const expected = new Date('2025-06-26'); // Thurday 26 June 2025

    expect(getNextDayOfWeek(pivot, 'Thursday')).toStrictEqual(expected);
});

test('get prev day of the week date, when prev date is ahead of pivot on week list', () => {
    const pivot = new Date('2025-06-01'); // Sunday 01 June 2025
    const expected = new Date('2025-05-29'); // Thrusday 29 May 2025

    expect(getPreviousDayOfWeek(pivot, 'Thursday')).toStrictEqual(expected);
});

test('get prev day of the week date, when prev date is behind of pivot on week list', () => {
    const pivot = new Date('2025-06-04'); // Wednesday 04 June 2025
    const expected = new Date('2025-05-30'); // Friday 30 May 2025

    expect(getPreviousDayOfWeek(pivot, 'Friday')).toStrictEqual(expected);
});

test('get prev day of the week date, when prev date is just a day behind pivot on week list', () => {
    const pivot = new Date('2025-06-04'); // Wednesday 04 June 2025
    const expected = new Date('2025-06-03'); // Tuesday 03 June 2025

    expect(getPreviousDayOfWeek(pivot, 'Tuesday')).toStrictEqual(expected);
});