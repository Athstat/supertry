/** Atoms that are all about Man of The Match voting */

import { atom } from "jotai";
import { ISbrFixtureRosterItem, ISbrMotmVote } from "../types/sbr";

export const userSbrMotmVoteAtom = atom<ISbrMotmVote>();

/** Atom holding a boolean value representing whether the user voted (true) or not (false) */
export const hasUserSubmittedSbrMotmAtom = atom<boolean>((get) => {
    const userVote = get(userSbrMotmVoteAtom);
    return userVote !== undefined;
});

export const sbrFixtureMotmVotesAtom = atom<ISbrMotmVote[]>([]);
export const sbrFixtureMotmCandidatesAtom = atom<ISbrFixtureRosterItem[]>([]);