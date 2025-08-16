import { atom } from "jotai";
import { SportActionDefinition } from "../types/sports_actions";

/** Holds sport action defintions */
export const sportActionDefinitionsAtom = atom<SportActionDefinition[]>([]);