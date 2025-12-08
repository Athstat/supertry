/** Player Atoms used to build a player profile */

import { atom } from "jotai";
import { IProAthlete } from "../types/athletes";
import { IProSeason } from "../types/season";
import { IFixture } from "../types/games";

/** Holds a player */
export const playerAtom = atom<IProAthlete>();

/** Holds the Seasons that a player has data for */
export const playerSeasonsAtom = atom<IProSeason[]>([]);

/** Returns the current/last season the player played in */
export const playerCurrentSeasonAtom = atom<IProSeason | undefined>((get) => {
    const seasons = get(playerSeasonsAtom);

    if (seasons.length === 0) return undefined;

    const sorted = [...seasons].sort((a, b) => {
        const aEnd = new Date(a.end_date ?? new Date()).valueOf();
        const bEnd = new Date(b.end_date ?? new Date()).valueOf();

        return bEnd - aEnd;
    });

    const lastSeason = sorted[0];

    return lastSeason;
});

/** Holds the selected fixture for a player */
export const playerSelectedFixtureAtom = atom<IFixture>();
