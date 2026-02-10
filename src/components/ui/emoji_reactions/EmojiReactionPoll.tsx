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
    const debouncedEmoji = useDebounced(emoji, 1000);

    const allReactions = [...(reactions?.all_reactions ?? [])]

    const allReactionOptions = [...allReactions].sort((a, b) => b.emoji.localeCompare(a.emoji));

    const handleClick = (newEmoji: string) => {

        if (newEmoji === emoji) {
            setEmoji(undefined);
        }

        setEmoji(newEmoji);

        if (showPicker) {
            togglePicker();
        }
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

            <CircleButton onClick={togglePicker} className=" min-w-10 min-h-10 bg-slate-300 dark:bg-slate-700" >
                <Plus />
            </CircleButton>

            <button onClick={handleTooltip} >
                <HelpCircle className="text-slate-400 w-4 h-4" />
            </button>

            <EmojiBottomSheetPicker 
                isOpen={showPicker}
                onClick={handleClick}
                onClose={togglePicker}
                emojies={EMOJI_REACTION_OPTIONS}
            />
        </div>
    )
}