import useSWR, { KeyedMutator } from "swr"
import { TopicReactions } from "../../types/ui"
import { createContext, ReactNode, useState } from "react"
import { emojiReactionService } from "../../services/ui/emojiReactionsService"
import { Toast } from "../../components/ui/Toast"

type TopicReactionsContextType = {
    topic: string,
    reactions?: TopicReactions,
    deleteReaction: () => void,
    updateReaction: (emoji: string) => void,
    refresh: KeyedMutator<TopicReactions | undefined>
}

export const TopicReactionsContext = createContext<TopicReactionsContextType | null>(null);

type Props = {
    topic: string,
    children?: ReactNode,
    loadingFallback?: ReactNode
}

/** A Provider that provides emoji reactions to its children for a given topic */
export default function TopicReactionsProvider({ topic, loadingFallback, children }: Props) {

    const key = `/emoji-reactions/${topic}`;

    const { data: reactions, isLoading: isFetching, isValidating, mutate } = useSWR(key, () => emojiReactionService.getSummary(topic), {
        revalidateIfStale: true,
        revalidateOnMount: true,
        // refreshInterval: 1000 * 10 // 10 seconds
    });

    const [isUpdating, setUpdating] = useState(false);
    const [error, setError] = useState<string>();

    const deleteReaction = async () => {

        const userReaction = reactions?.user_reaction;

        if (!userReaction) {
            return;
        }

        setUpdating(true);

        const oldReactionsObj = reactions ? {...reactions} : undefined;

        mutate(emojiReactionService.optimisticDelete(
            reactions, userReaction.emoji
        ))

        const success = await emojiReactionService.deleteReaction(topic);

        if (!success) {
            // roll back reactions when there is an error
            mutate(oldReactionsObj);
            setError("Something wen't wrong deleting your reaction");
        }

        setUpdating(false);
    }

    const updateReaction = async (emoji: string) => {

        setError(undefined);
        setUpdating(true);

        const originalReactionsObj: TopicReactions | undefined = reactions ? { ...reactions } : undefined;

        // apply optimistic update
        mutate(emojiReactionService.optmisticUpdateReaction(
            topic, reactions, emoji
        ));

        const success = await emojiReactionService.updateReaction(topic, emoji);

        if (!success) {
            // roll back optimistic update if there is an error
            mutate(originalReactionsObj);
            setError("Something wen't wrong making reaction");
        }

        setUpdating(false);
    }

    const isLoading = isUpdating || isFetching || isValidating;

    if (isLoading && loadingFallback) {
        return <>{loadingFallback}</>
    }

    return (
        <TopicReactionsContext.Provider
            value={{
                refresh: mutate,
                reactions,
                updateReaction,
                deleteReaction,
                topic
            }}
        >
            {children}

            {error && (
                <Toast 
                    message={error}
                    type="error"
                    isVisible={Boolean(error)}
                    onClose={() => setError(undefined)}
                />
            )}
        </TopicReactionsContext.Provider>
    )
}
