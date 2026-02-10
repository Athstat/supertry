import { useContext } from "react";
import { TopicReactionsContext } from "../../contexts/ui/TopicReactionsContext";

/** Hook for working with user reactions */
export function useTopicReactions() {
    const context = useContext(TopicReactionsContext);

    if (context === null) {
        throw new Error("useTopicReaction() was used outside the TopicReactionsProvider");
    }

    const userReaction = context.reactions?.user_reaction;

    return {
        ...context,
        userReaction
    }
}