/** Rendered when there are no reactions and we want user to make reaction */

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions";
import { useDebounced } from "../../../hooks/web/useDebounced";
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants";
import EmojiReactionButton from "./EmojiReactionButton";
import { HelpCircle } from "lucide-react";
import { useTooltip } from "../../../hooks/ui/useTooltip";


export default function EmojiReactionPoll() {

    const { reactions, userReaction, deleteReaction, updateReaction } = useTopicReactions();

    const {openTooltipModal} = useTooltip();

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

    const handleTooltip = () => {
        openTooltipModal("Emoji Reactions", "Whether its a dissapointing defeat, encouraging win or dominant performance, express your reaction and let the emoji do all the talking.")
    }


    if (!reactions?.all_reactions) {
        return null;
    }

    return (
        <div className="flex flex-row items-center gap-2 flex-wrap" >

            {allReactionOptions.map((r) => {
                const isUserReaction = Boolean(emoji === r.emoji.toLowerCase());

                return <EmojiReactionButton
                    key={r.emoji}
                    emoji={r.emoji}
                    count={r.reaction_count}
                    showBorder
                    className={twMerge(
                        isUserReaction && "border-blue-400 dark:border-blue-600 bg-blue-400/20 hover:bg-blue-400/20 dark:bg-blue-600/20"
                    )}
                    onClick={handleClick}
                />
            })}

            <button onClick={handleTooltip} >
                <HelpCircle className="text-slate-400 w-4 h-4" />
            </button>
        </div>
    )
}