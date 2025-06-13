/** Sbr Fixtures Atoms */

import { atom } from "jotai";
import { ISbrFixture } from "../types/sbr";
import { getLastWednesdayIfNotWednesday, getNextTuesdayIfNotTuesday } from "../utils/dateUtils";
import { endOfDay, startOfDay } from "date-fns";
import { filterSbrFixturesByDateRange } from "../utils/sbrUtils";

export const allSbrWeekFixturesAtom = atom<ISbrFixture[]>([]);
export const sbrFixturesPivotDateAtom = atom<Date>(new Date());

export const sbrFixturesWeekStartAtom = atom<Date>((get) => {
    const pivot = get(sbrFixturesPivotDateAtom);
    const weekStart = getLastWednesdayIfNotWednesday(new Date(pivot));
    return startOfDay(weekStart);
});

export const sbrFixturesWeekEndAtom = atom<Date>((get) => {
    const pivot = get(sbrFixturesPivotDateAtom);
    const weekEnd = getNextTuesdayIfNotTuesday(new Date(pivot));
    return endOfDay(weekEnd);
});


/** Atom holding Sbr Week fixtures  */
export const sbrWeekFixturesAtom = atom<ISbrFixture[]>((get) => {
    const allFixtures = get(allSbrWeekFixturesAtom);
    const weekStart = get(sbrFixturesWeekStartAtom);
    const weekEnd = get(sbrFixturesWeekEndAtom);

    return filterSbrFixturesByDateRange(allFixtures, weekStart, weekEnd);
});

/** Atom holding a sbr week feature games */
export const sbrWeekFeatureGamesAtom = atom<ISbrFixture[]>((get) => {
    const fixtures = get(sbrWeekFixturesAtom);
    return fixtures.filter((f) => {
        return f.is_feature_game === true;
    })
});

export const currentSbrFixtureAtom = atom<ISbrFixture>();
