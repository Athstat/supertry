/** Rendered when there are no reactions and we want user to make reaction */

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions";
import { useDebounced } from "../../../hooks/web/useDebounced";
import EmojiReactionButton from "./EmojiReactionButton";
import { HelpCircle, Plus } from "lucide-react";
import { useTooltip } from "../../../hooks/ui/useTooltip";
import CircleButton from "../buttons/BackButton";
import { EmojiBottomSheetPicker } from "./EmojiReactionPicker";
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants";


export default function EmojiReactionPoll() {

    const { reactions, userReaction, deleteReaction, updateReaction } = useTopicReactions();
    const [showPicker, setShowPicker] = useState(false);
    const togglePicker = () => setShowPicker(prev => !prev);

    const { openTooltipModal } = useTooltip();

    const [emoji, setEmoji] = useState(userReaction?.emoji);
    const debouncedEmoji = useDebounced(emoji, 200);

    const currentReactions = [...(reactions?.all_reactions ?? []),]

    const allReactionOptions = [
        ...currentReactions,
    ].sort((a, b) => b.emoji.localeCompare(a.emoji)).slice(0, 5);

    const handleClick = (newEmoji: string) => {

        if (newEmoji === emoji) {
            setEmoji(undefined);
            return;
        }

        setEmoji(newEmoji);

        if (showPicker) {
            togglePicker();
        }
    }

    useEffect(() => {

        
        const fetcher = () => {
            
            // prevents uneccessary PUT request on on mount
            if (debouncedEmoji === userReaction?.emoji) {
                return;
            }
            
            if (debouncedEmoji === undefined) {
                deleteReaction();
                return;
            }
            
            updateReaction(debouncedEmoji);
            console.log("Code  in use effect to make PUT request");
        }

        fetcher();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEmoji]);

    const otherEmojiOptions = EMOJI_REACTION_OPTIONS.filter((f) => {
        return !currentReactions.find((r) => r.emoji === f);
    })

    const handleTooltip = () => {
        openTooltipModal("Emoji Reactions", "Whether its a dissapointing defeat, encouraging win or dominant performance, express your reaction with an emoji!")
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

            <CircleButton onClick={togglePicker} className="h-8 w-8 bg-slate-300 dark:bg-slate-700" >
                <Plus className="h-6 w-6" />
            </CircleButton>

            <button onClick={handleTooltip} >
                <HelpCircle className="text-slate-400 w-5 h-5" />
            </button>

            <EmojiBottomSheetPicker
                isOpen={showPicker}
                onClick={handleClick}
                onClose={togglePicker}
                emojies={otherEmojiOptions}
            />
        </div>
    )
}