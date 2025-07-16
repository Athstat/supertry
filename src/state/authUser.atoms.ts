import { atom } from "jotai";
import { DjangoAuthUser } from "../types/auth";

/** Holds the currently logged in user as an atom */
export const authUserAtom = atom<DjangoAuthUser>();

/** Holds a boolean value, if true then auth user is a guest user */
export const isGuestUserAtom = atom<boolean | undefined>((get) => {
    const authUser = get(authUserAtom);
    
    if (authUser) {
        return authUser.is_claimed_account === false;
    }

    return undefined;
})