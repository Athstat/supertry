/** Atoms for a season */

import { atom } from "jotai";
import { IFixture, ISeason, ITeam } from "../types/games";
import { IProAthlete } from "../types/athletes";

export const seasonAtom = atom<ISeason>();
export const seasonFixtutesAtoms = atom<IFixture[]>([]);
export const seasonAthletesAtoms = atom<IProAthlete[]>([]);
export const seasonTeamsAtoms = atom<ITeam[]>([])