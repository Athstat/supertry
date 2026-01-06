import { atom } from "jotai";

/** Atom that stores the currently filtered date range */
export const fixturesDateRangeAtom = atom<Date[]>();

/** Atom that stores the selected month index */
export const fixturesSelectedMonthIndexAtom = atom<number>(new Date().getMonth());