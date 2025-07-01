/** Atoms for a season */

import { atom } from "jotai";
import { IFixture, ISeason, ITeam } from "../types/games";
import { RugbyPlayer } from "../types/rugbyPlayer";

export const seasonAtom = atom<ISeason>();
export const seasonFixtutesAtoms = atom<IFixture[]>([]);
export const seasonAthletesAtoms = atom<RugbyPlayer[]>([]);
export const seasonTeamsAtoms = atom<ITeam[]>([])