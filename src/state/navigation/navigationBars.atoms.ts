// We need to make atoms that allow us to control the visibility of the top app bar and bottom app bars

import { atom } from "jotai";

export type NavigationElementViewMode = "hidden" | "visible";

const topBarViewModeAtom = atom<NavigationElementViewMode>("visible");
const bottomBarViewModeAtom = atom<NavigationElementViewMode>("visible");

/** Atoms for manipulating state of the navigation bars */
export const navigationBarsAtoms = {
    topBarViewModeAtom,
    bottomBarViewModeAtom
}