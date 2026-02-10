import { twMerge } from "tailwind-merge"
import TopicReactionsProvider from "../../../contexts/ui/TopicReactionsContext"
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions"
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants"
import RoundedCard from "../cards/RoundedCard"

type Props = {
    topic: string,
}

/** Renders an emoji reaction bar */
export default function EmojiReactionBar({ topic }: Props) {
    return (
        <TopicReactionsProvider topic={topic} >
            <Content />
        </TopicReactionsProvider>
    )
}

/** We have three reaction states 
 * 
 * 1. no reactions were made by any user
 * 2. reactions made by some user
 * 
 * a user can make an inifinate amount of reactions
 * 
*/

function Content() {

    const { isNoReactions } = useTopicReactions();

    return (
        <div>
            {isNoReactions && <EmojiReactionPicker />}
            {!isNoReactions && <EmojiReactionPoll />}
        </div>
    )
}

/** Rendered when there are no reactions and we want user to make reaction */
function EmojiReactionPicker() {

    const { updateReaction } = useTopicReactions();

    const handleClick = (emoji: string) => {
        updateReaction(emoji);
    }

    return (
        <RoundedCard className="flex flex-row min-h-[55px] max-h-[55px] items-center gap-3 bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-700 rounded-full px-4 py-2 w-fit border border-slate-200" >
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

function EmojiReactionPoll() {

    const {reactions} = useTopicReactions();

    if (!reactions?.all_reactions) {
        return null;
    }

    const otherOptions = EMOJI_REACTION_OPTIONS.filter((e) => {
        return !reactions.all_reactions.find((r) => r.emoji === e);
    });

    return (
        <div>
            {reactions.all_reactions.map((r) => {
                return <EmojiReactionButton 
                    emoji={r.emoji}
                />
            })}

            {otherOptions.map((e) => {
                return (
                    <EmojiReactionButton
                        emoji={e}
                    />
                )
            })}
        </div>
    )
}

type EmojiReactionButtonProps = {
    emoji: string,
    onClick?: (emoji: string) => void,
    count?: number,
    className?: string
}

function EmojiReactionButton({ emoji, onClick, className }: EmojiReactionButtonProps) {
    

    const handleClick = () => {
        if (onClick) {
            onClick(emoji);
        }
    }
    
    return (
        <button
            className={twMerge(
                "text-[24px] w-[40px] h-[40px] rounded-xl active:bg-slate-800 transition-all delay-0 hover:-rotate-12",
                className
            )}
            onClick={handleClick}
        >
            {emoji}
        </button>
    )
}