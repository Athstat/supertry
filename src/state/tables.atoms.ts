import { atom } from "jotai";
import { SortDirection } from "../types/playerSorting";

export const tableSortIndexAtom = atom<number>(0);
export const tableSortDirectionAtom = atom<SortDirection>("desc");
