import TopicReactionsProvider from "../../../contexts/ui/TopicReactionsContext"
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions"
import Experimental from "../ab_testing/Experimental"
import RoundedCard from "../cards/RoundedCard"
import EmojiReactionPicker from "./EmojiReactionPicker"
import EmojiReactionPoll from "./EmojiReactionPoll"

type Props = {
    topic: string,
}

/** Renders an emoji reaction bar */
export default function EmojiReactionBar({ topic }: Props) {
    return (
        <TopicReactionsProvider
            topic={topic}
            loadingFallback={<RoundedCard className="h-[50px] bg-slate-200 animate-pulse border-none" />}
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
        <Experimental>
            <div>
                {isNoReactions && <EmojiReactionPicker />}
                {!isNoReactions && <EmojiReactionPoll />}
            </div>
        </Experimental>
    )
}



