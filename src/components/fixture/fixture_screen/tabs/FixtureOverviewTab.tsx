import { IFixture } from "../../../../types/games"
import GameHighlightsCard from "../../../ui/video/GameHighlightsCard"
import { FixtureVotingCard } from "../../../pickem/voting/FixtureVotingCard"
import PreFixtureForm from "../cards/PreFixtureForm"
import PastMatchupsCard from "../cards/PastMatchupsCard"
import FixturePotmCard from "../cards/FixturePotmCard"
import FixtureKeyEventsCard from "../cards/FixtureKeyEventsCard"
import EmojiReactionBar from "../../../ui/emoji_reactions/EmojiReactionBar"

type Props = {
    fixture: IFixture
}

/** Renders fixture overview tab */
export default function FixtureOverviewTab({ fixture }: Props) {

    return (

        <div className="flex flex-col gap-6" >

            <GameHighlightsCard link={fixture.highlights_link} />

            <EmojiReactionBar topic={`fixtures-${fixture.game_id}`} />

            <FixtureVotingCard fixture={fixture} />

            <FixtureKeyEventsCard fixture={fixture} />
            
            <FixturePotmCard 
                fixture={fixture}
            />

            <PreFixtureForm
                fixture={fixture}
            />

            <PastMatchupsCard
                fixture={fixture}
            />


        </div>
    )
}
