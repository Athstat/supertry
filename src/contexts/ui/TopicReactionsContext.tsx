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
    refresh: KeyedMutator<TopicReactions | undefined>,
    isLoading?: boolean
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

    const { data: reactions, isLoading: isFetching, mutate } = useSWR(key, () => emojiReactionService.getSummary(topic), {
        revalidateOnFocus: true
    });

    const [error, setError] = useState<string>();

    const deleteReaction = async () => {

        const userReaction = reactions?.user_reaction;

        if (!userReaction) {
            return;
        }

        const success = await emojiReactionService.deleteReaction(topic);

        if (success) {
            mutate(emojiReactionService.optimisticDelete(
                reactions, userReaction.emoji
            ))
        }

        if (!success) {
            setError("Something wen't wrong deleting your reaction");
            return;
        }

    }

    const updateReaction = async (emoji: string) => {

        setError(undefined);
        const success = await emojiReactionService.updateReaction(topic, emoji);

        if (success) {
            mutate(emojiReactionService.optmisticUpdateReaction(
                topic, reactions, emoji
            ));
        }

        if (!success) {
            setError("Something wen't wrong making reaction");
            return;
        }

    }

    const isLoading = isFetching;

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
                topic,
                isLoading
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
