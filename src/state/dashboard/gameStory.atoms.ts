import { atom } from "jotai";

/** Holds a boolean value whether a story has been paused or not */
const isPausedAtom = atom<boolean>(false);

/** Holds the progress of the story slides */
const progressAtom = atom<number>(0);

/** Holds the current slides index */
const currentSlideIndexAtom = atom<number>(0);


export const gameStoryAtoms = {
    isPausedAtom,
    progressAtom,
    currentSlideIndexAtom
}
