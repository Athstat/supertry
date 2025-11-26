import { atom } from "jotai";
import { RouterHistoryStack } from "../../utils/web/browserUtils";

/** Holds the Browser History Stack */
const historyStackAtom = atom<RouterHistoryStack>(new RouterHistoryStack());

export const browserHistoryAtoms = {
    historyStackAtom
}