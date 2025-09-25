import { atom } from "jotai";
import { IFantasySeason } from "../../types/fantasy/fantasySeason";

/** Holds the available list of fantasy seasons */
export const fantasySeasonsAtom = atom<IFantasySeason[]>([]);

export const SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY = 'sfsqpk'