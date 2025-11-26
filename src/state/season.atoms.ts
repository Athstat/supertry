/** Atoms for a season */

import { atom } from "jotai";
import { IFixture, ITeam } from "../types/games";
import { IProAthlete } from "../types/athletes";
import { IProSeason } from "../types/season";

export const seasonAtom = atom<IProSeason>();
export const seasonFixtutesAtoms = atom<IFixture[]>([]);
export const seasonAthletesAtoms = atom<IProAthlete[]>([]);
export const seasonTeamsAtoms = atom<ITeam[]>([])