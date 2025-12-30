import { usePlayerNextMatch } from "../../../hooks/athletes/usePlayerNextMatch"
import { IProAthlete } from "../../../types/athletes"
import FixtureCard from "../../fixtures/FixtureCard"
import NoContentCard from "../../shared/NoContentMessage"
import RoundedCard from "../../shared/RoundedCard"

type Props = {
    player: IProAthlete
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
                className="border-none w-full hover:bg-transparent dark:hover:bg-transparent p-0 bg-transparent dark:bg-transparent"
            />}

            {!nextMatch && (
                <NoContentCard message="Player's next match was not found" />
            ) }
        </RoundedCard>
    )
}
