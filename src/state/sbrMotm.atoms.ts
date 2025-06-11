/** Atoms that are all about Man of The Match voting */

import { atom } from "jotai";
import { ISbrFixtureRosterItem, ISbrMotmVote } from "../types/sbr";

export const userSbrMotmVoteAtom = atom<ISbrMotmVote>();

/** Atom holding a boolean value representing whether the user voted (true) or not (false) */
export const hasUserSubmittedSbrMotmAtom = atom<boolean>((get) => {
    const userVote = get(userSbrMotmVoteAtom);
    return userVote !== undefined;
});

/** Atom holding a boolean value representing whether an network request is being
 * made to send a fetch post req to update the users vote
 */
export const isSendingSbrMotmVoteAtom = atom<boolean>(false);

export const sbrFixtureMotmVotesAtom = atom<ISbrMotmVote[]>([]);
export const sbrFixtureMotmCandidatesAtom = atom<ISbrFixtureRosterItem[]>([]);