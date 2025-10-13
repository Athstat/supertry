import { atom } from "jotai";
import { BoxscoreHeader, BoxscoreListRecordItem } from "../../types/boxScore";

/** Holds the tilte of a boxscore table */
const titleAtom = atom<string>("");

/** Holds the columns of a boxscore */
const columnsAtom = atom<BoxscoreHeader[]>([]);

/** Holds the records of a boxscore */
const recordsAtom = atom<BoxscoreListRecordItem[]>([]);

export const boxscoreTableAtoms = {
    titleAtom, 
    columnsAtom,
    recordsAtom
} 