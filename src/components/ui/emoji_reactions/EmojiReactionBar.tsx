import { twMerge } from "tailwind-merge"
import TopicReactionsProvider from "../../../contexts/ui/TopicReactionsContext"
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions"
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants"
import RoundedCard from "../cards/RoundedCard"
import SecondaryText from "../typography/SecondaryText"
import { compactNumber } from "../../../utils/intUtils"

type Props = {
    topic: string,
}

/** Renders an emoji reaction bar */
export default function EmojiReactionBar({ topic }: Props) {
    return (
        <TopicReactionsProvider 
            topic={topic} 
            loadingFallback={<RoundedCard className="h-[50px] animate-pulse border-none" />}
        >
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

    const {reactions, userReaction, deleteReaction, updateReaction} = useTopicReactions();

    if (!reactions?.all_reactions) {
        return null;
    }

    
    const otherOptions = [...EMOJI_REACTION_OPTIONS].filter((e) => {
        return !reactions.all_reactions.find((r) => r.emoji === e);
    });

    const allReactionOptions = [...reactions.all_reactions, ...(otherOptions.map((e) => {
        return {emoji: e, reaction_count: 0}
    }))].sort((a, b) => b.emoji.localeCompare(a.emoji));
    
    const handleClick = (emoji: string) => {
        if (userReaction?.emoji.toLowerCase() === emoji.toLowerCase()) {
            deleteReaction();
            return;
        }

        updateReaction(emoji);
    }

    return (
        <div className="flex flex-row items-center gap-2" >

            {allReactionOptions.map((r) => {
                const isUserReaction = Boolean(userReaction?.emoji.toLowerCase() === r.emoji.toLowerCase());

                return <EmojiReactionButton 
                    key={r.emoji}
                    emoji={r.emoji}
                    count={r.reaction_count}
                    showBorder
                    className={twMerge(
                        isUserReaction && "border-blue-500 dark:border-blue-600 dark:bg-blue-600/20"
                    )}
                    onClick={handleClick}
                />
            })}

        </div>
    )
}

type EmojiReactionButtonProps = {
    emoji: string,
    onClick?: (emoji: string) => void,
    count?: number,
    className?: string,
    showBorder?: boolean
}

function EmojiReactionButton({ emoji, onClick, className, count, showBorder }: EmojiReactionButtonProps) {
    
    const handleClick = () => {
        if (onClick) {
            onClick(emoji);
        }
    }

    const showCount = count !== undefined && count > 0;
    
    return (
        <button
            className={twMerge(
                "text-[24px] w-[40px] flex flex-row items-center justify-center gap-1 h-[40px] rounded-xl active:bg-slate-800 transition-all delay-0 hover:-rotate-12",
                showBorder && "border-[1px] hover:rotate-0 dark:border-slate-600 hover:bg-slate-500 hover:dark:bg-slate-700/60 px-3 py-0.5 w-fit h-fit text-[16px] rounded-2xl",
                className
            )}
            onClick={handleClick}
        >
            <p>{emoji}</p>
            {showCount && <SecondaryText className="text-sm" >{compactNumber(count)}</SecondaryText>}
        </button>
    )
}