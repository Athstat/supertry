/** Atoms that are all about Man of The Match voting */

import { atom } from "jotai";
import { ISbrMotmVote } from "../types/sbr";

export const userMotmVoteAtom = atom<ISbrMotmVote>();

/** Atom holding a boolean value representing whether the user voted (true) or not (false) */
export const hasUserVotedMotmAtom = atom<boolean>((get) => {
    const userVote = get(userMotmVoteAtom);
    return userVote !== undefined;
});

export const sbrFixtureMotmVotes = atom<ISbrMotmVote[]>([]);