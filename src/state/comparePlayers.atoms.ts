// ATOMS

import { atom } from "jotai";
import { IProAthlete, PlayerCompareMode } from "../types/athletes";
import { IComparePlayerStats, ICompareStarRatingsStats } from "../types/comparePlayers";
import { SportActionDefinition } from "../types/sports_actions";

/** Holds the players to compare */
export const comparePlayersAtom = atom<IProAthlete[]>([]);

/* Holds the stats for the compare players */
export const comparePlayersStatsAtom = atom<IComparePlayerStats[]>([]);

/* Holds the star ratings for the compare players */
export const comparePlayersStarRatingsAtom = atom<ICompareStarRatingsStats[]>([]);

/** Holds a boolean whether player info should be showed or not */
export const showComparePlayerInfo = atom<boolean>(false);

/** Holds a string representing the state of the player compare 
 * which can either be none, picking and modal */
export const compareModeAtom = atom<PlayerCompareMode>("none");

/** Holds a boolean value that flags whether the compare mode
 * is on picking */
export const isCompareModePicking = atom<boolean>((get) => {
    return get(compareModeAtom) === "picking";
});

/** Holds a boolean value that flags whether the compare mode
 * is on modal */
export const isCompareModeModal = atom<boolean>((get) => {
    return get(compareModeAtom) === "modal"
})

/** A map of player tracking id and the player object itself as a map */
export const comparePlayersMapAtom = atom<Map<string, IProAthlete>>((get) => {
    const players = get(comparePlayersAtom);
    const map: Map<string, IProAthlete> = new Map();

    players.forEach((p) => {
        map.set(p.tracking_id, p);
    });

    return map;
})

/** Holds the collapsed state of stat categories */
export const statCategoriesCollapsedAtom = atom<{
    overalls: boolean;
    attacking: boolean;
    defending: boolean;
    kicking: boolean;
}>({
    overalls: false,
    attacking: false,
    defending: false,
    kicking: false
});



/** Object that holds all compare player feature atoms */
export const comparePlayersAtomGroup = {
    comparePlayersAtom,
    comparePlayersStatsAtom,
    comparePlayersStarRatingsAtom,
    showComparePlayerInfo,
    compareModeAtom,
    isCompareModePicking,
    isCompareModeModal,
    comparePlayersMapAtom,
    statCategoriesCollapsedAtom
}
