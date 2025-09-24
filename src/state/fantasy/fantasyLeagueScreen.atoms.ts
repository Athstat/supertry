import { atom } from "jotai";
import { IFantasySeason } from "../../types/fantasy/fantasySeason";

/** Holds the available list of fantasy seasons */
export const fantasySeasonsAtom = atom<IFantasySeason[]>([]);

/** Holds the selected fantasy season atom currently being displayed */
export const selectedFantasySeasonAtom = atom<IFantasySeason>();

export const SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY = 'sfsqpk'