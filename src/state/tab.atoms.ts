import { atom } from "jotai";

/** Factory for creating a tab atom */
export const createTabAtom = (defaultTab?: string) => atom(defaultTab);