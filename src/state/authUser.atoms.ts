import { atom } from "jotai";
import { DjangoAuthUser } from "../types/auth";

/** Holds the currently logged in user as an atom */
export const authUserAtom = atom<DjangoAuthUser>();