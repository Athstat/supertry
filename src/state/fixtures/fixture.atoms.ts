import { atom } from "jotai";
import { IFixture } from "../../types/games";
import { IProAthlete } from "../../types/athletes";

/** Holds a fixture */
export const fixtureAtom = atom<IFixture>();

/* Holds the selected athlete on fixture screen */
export const fixtureSelectedPlayerAtom = atom<IProAthlete>();