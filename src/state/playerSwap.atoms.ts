/** Atoms that have to do with player swapping */

import { atom } from "jotai";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { IFantasyTeamAthlete } from "../types/fantasyTeamAthlete";

export const playerToSwapInAtom = atom<RugbyPlayer>();
export const playerToSwapOutAtom =  atom<IFantasyTeamAthlete>();
export const positionToSwapAtom = atom<string>('any');

