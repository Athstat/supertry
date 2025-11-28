import { atom } from "jotai";
import { IFixture } from "../../types/games";
import { IProAthlete } from "../../types/athletes";

/** Holds a fixture */
export const fixtureAtom = atom<IFixture>();

/* Holds the selected athlete on fixture screen */
export const fixtureSelectedPlayerAtom = atom<IProAthlete>();

/** Holds a true or false value whether the player profile modal should be shown or not */
export const showPlayerProfileAtom = atom<boolean>(false);

/** Holds a true or false value whether the player match modal should be shown */
export const showPlayerMatchModalAtom = atom<boolean>(false);