import { createContext } from "react";
import { ISbrFixtureRosterItem } from "../types/sbr";

type ContextProps = {
    hasUserVoted: boolean,
    onVote: (rosterItem: ISbrFixtureRosterItem) => Promise<void>,
    isVoting: boolean,
    onRemoveVote: () => void
}


// const SbrMotmVotingBoxContext = createContext<>();