import { atom } from "jotai";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { SportAction } from "../types/sports_actions";

/** Atom that holds the players to be compared */
export const comparePlayersAtom = atom<RugbyPlayer[]>([]);

/** Atom that holds a record that has compare players stats keyed by athlete id */
export const comparePlayersStatsAtom = atom<Record<string, SportAction[]>>({});

