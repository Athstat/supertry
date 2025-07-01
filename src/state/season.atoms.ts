/** Atoms for a season */

import { atom } from "jotai";
import { IFixture, ISeason } from "../types/games";
import { RugbyPlayer } from "../types/rugbyPlayer";

export const seasonAtom = atom<ISeason>();
export const seasonFixtutes = atom<IFixture>();
export const seasonAthletes = atom<RugbyPlayer>();