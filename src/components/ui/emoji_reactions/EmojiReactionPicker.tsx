import { useTopicReactions } from "../../../hooks/ui/useTopicReactions";
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants";
import RoundedCard from "../cards/RoundedCard";
import EmojiReactionButton from "./EmojiReactionButton";

export default function EmojiReactionPicker() {

    const { updateReaction } = useTopicReactions();

    const handleClick = (emoji: string) => {
        updateReaction(emoji);
    }

    return (
        <RoundedCard className="flex flex-row min-h-[55px] max-h-[55px] items-center gap-2 bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-700 rounded-full px-4 py-2 w-fit border border-slate-200" >
            {EMOJI_REACTION_OPTIONS.map((emoji) => {
                return (
                    <EmojiReactionButton
                        emoji={emoji}
                        onClick={handleClick}
                    />
                )
            })}
        </RoundedCard>
    )
}