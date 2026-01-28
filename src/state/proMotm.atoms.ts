/** Atoms for PRO games Man of The Match voting */

import { atom } from "jotai";
import { IProMotmVote } from "../types/proMotm";
import { IRosterItem } from "../types/fixtures";
import { authService } from "../services/authService";

export const proGameMotmVotesAtom = atom<IProMotmVote[]>([]);

export const userProMotmVoteAtom = atom<IProMotmVote | undefined>((get) => {
    const allVotes = get(proGameMotmVotesAtom);
    const userId = authService.getUserInfoSync()?.kc_id;
    
    const userVote = allVotes.find((v) => {
        return v.user_id === userId;
    });

    return userVote;
});

/** Atom holding a boolean value representing whether the user voted (true) or not (false) */
export const hasUserSubmittedProMotmAtom = atom<boolean>((get) => {
    const userVote = get(userProMotmVoteAtom);
    return userVote !== undefined;
});

/** Atom holding a boolean value representing whether a network request is being
 * made to send a fetch post req to update the users vote
 */
export const isSendingProMotmVoteAtom = atom<boolean>(false);

export const proGameMotmCandidatesAtom = atom<IRosterItem[]>([]);

export const currentProGameAtom = atom<string>("");
