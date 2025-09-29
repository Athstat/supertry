import { atom } from "jotai";

/** Holds a boolean value whether a story has been paused or not */
const isPausedAtom = atom<boolean>(false);

export const gameStoryAtoms = {
    isPausedAtom
}