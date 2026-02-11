import { useContext } from "react";
import { TopicReactionsContext } from "../../contexts/ui/TopicReactionsContext";

/** Hook for working with user reactions */
export function useTopicReactions() {
    const context = useContext(TopicReactionsContext);

    if (context === null) {
        throw new Error("useTopicReaction() was used outside the TopicReactionsProvider");
    }

    const userReaction = context.reactions?.user_reaction;
    const isNoReactions = (context.reactions?.all_reactions ?? []).length === 0;

    return {
        ...context,
        userReaction,
        isNoReactions
    }
}