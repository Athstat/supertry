import { atom } from "jotai";
import { IFixture } from "../../types/games";

/** Holds a boolean value whether a story has been paused or not */
const isPausedAtom = atom<boolean>(true);

/** Holds the progress of the story slides */
const progressAtom = atom<number>(0);

/** Holds the current slides index */
const currentSlideIndexAtom = atom<number>(0);

const currentGameAtom = atom<IFixture>();


export const gameStoryAtoms = {
    isPausedAtom,
    progressAtom,
    currentSlideIndexAtom,
    currentGameAtom
}
