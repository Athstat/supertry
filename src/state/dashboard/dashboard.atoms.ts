import { atom } from "jotai";
import { IFantasySeason, ISeasonRound } from "../../types/fantasy/fantasySeason";

/** Holds the current season Atom */
const currentSeasonAtom = atom<IFantasySeason>();
const currentSeasonRoundAtom = atom<ISeasonRound>();
const seasonRoundsAtom = atom<ISeasonRound[]>([]);
const isDashboardLoadingAtom = atom<boolean>(false);
 

export const dashboardAtoms = {
    currentSeasonAtom,
    currentSeasonRoundAtom,
    isDashboardLoadingAtom,
    seasonRoundsAtom
}