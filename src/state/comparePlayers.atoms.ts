// ATOMS

import { atom } from "jotai";
import { IProAthlete } from "../types/athletes";
import { IComparePlayerStats, ICompareStarRatingsStats } from "../types/comparePlayers";

/** Holds the players to compare */
export const comparePlayersAtom = atom<IProAthlete[]>([]);

/* Holds the stats for the compare players */
export const comparePlayersStatsAtom = atom<IComparePlayerStats[]>([]);

/* Holds the star ratings for the compare players */
export const comparePlayersStarRatingsAtom = atom<ICompareStarRatingsStats[]>([]);

