import { usePlayerNextMatch } from "../../../hooks/athletes/usePlayerNextMatch"
import FixtureCard from "../../fixture/FixtureCard"
import NoContentCard from "../../ui/typography/NoContentMessage"
import RoundedCard from "../../shared/RoundedCard"

type Props = {
    player: {tracking_id: string}
}

/** Player Next Match Card */
export default function PlayerNextMatchCard({ player }: Props) {

    const {nextMatch, isLoading} = usePlayerNextMatch(player.tracking_id);

    if (isLoading) {
        return (
            <RoundedCard className="min-h-[170px] border-none animate-pulse" >

            </RoundedCard>
        )
    }

    return (
        <RoundedCard className="p-4 flex min-h-[170px] flex-col gap-4" >
            <div>
                <p className="text-sm font-bold" >Next Match</p>
            </div>

            {nextMatch && <FixtureCard  
                fixture={nextMatch}
                showCompetition
                showLogos
                className="border-none w-full shadow-none hover:bg-transparent dark:hover:bg-transparent p-0 bg-transparent dark:bg-transparent"
            />}

            {!nextMatch && (
                <NoContentCard message="Player's next match was not found" />
            ) }
        </RoundedCard>
    )
}
