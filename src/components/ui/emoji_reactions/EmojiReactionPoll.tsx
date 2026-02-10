/** Rendered when there are no reactions and we want user to make reaction */

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions";
import { useDebounced } from "../../../hooks/web/useDebounced";
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants";
import EmojiReactionButton from "./EmojiReactionButton";


export default function EmojiReactionPoll() {

    const { reactions, userReaction, deleteReaction, updateReaction } = useTopicReactions();

    const [emoji, setEmoji] = useState(userReaction?.emoji);
    const debouncedEmoji = useDebounced(emoji, 1000);

    const allReactions = [...(reactions?.all_reactions ?? [])]

    const otherOptions = [...EMOJI_REACTION_OPTIONS].filter((e) => {
        return !allReactions.find((r) => r.emoji === e);
    });

    const allReactionOptions = [...allReactions, ...(otherOptions.map((e) => {
        return { emoji: e, reaction_count: 0 }
    }))].sort((a, b) => b.emoji.localeCompare(a.emoji));

    const handleClick = (newEmoji: string) => {
        if (newEmoji === emoji) {
            setEmoji(undefined);
        }
        setEmoji(newEmoji);
    }

    useEffect(() => {

        console.log("Code  in use effect Ran");

        const fetcher = () => {

            if (debouncedEmoji === undefined) {
                deleteReaction();
                return;
            }

            updateReaction(debouncedEmoji);
        }

        fetcher();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEmoji]);


    if (!reactions?.all_reactions) {
        return null;
    }

    return (
        <div className="flex flex-row items-center gap-2" >

            {allReactionOptions.map((r) => {
                const isUserReaction = Boolean(emoji === r.emoji.toLowerCase());

                return <EmojiReactionButton
                    key={r.emoji}
                    emoji={r.emoji}
                    count={r.reaction_count}
                    showBorder
                    className={twMerge(
                        isUserReaction && "border-blue-500 dark:border-blue-600 bg-blue-400/20 dark:bg-blue-600/20"
                    )}
                    onClick={handleClick}
                />
            })}

        </div>
    )
}