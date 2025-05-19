import { atom } from "jotai";

/** Atom that stores the currently filtered date range */
export const fixturesDateRangeAtom = atom<Date[]>();
export const fixturesSelectedMonth = atom<number>();