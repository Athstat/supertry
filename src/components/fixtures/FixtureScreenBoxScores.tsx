import useSWR from "swr"
import { IFixture } from "../../types/games"
import FixtureDisciplineStats from "./FixtureDisciplineStats"
import FixtureHeadToHeadStats from "./FixtureHeadToHeadStats"
import FixtureKickingStats from "./FixtureKickingStats"
import AthleteBoxScoreList from "./AthleteBoxScoreList"
import { boxScoreService } from "../../services/boxScoreService"
import { LoadingState } from "../ui/LoadingState"
import { ErrorState } from "../ui/ErrorState"

type Props = {
    fixture: IFixture
}

export default function FixtureScreenBoxScores({ fixture }: Props) {

    const {data: boxscore, isLoading, error} = useSWR(fixture.game_id, boxScoreService.getBoxScoreByGameId);

    if (isLoading) return <LoadingState message="Fetching Box Score Information" />

    if (!boxscore || error) return <ErrorState message="Failed to fetch box score information" />

    const forwardsBoxScore = boxscore.filter((bs) => {
        return bs.player_type === "Forward";
    })

    const backsBoxScore = boxscore.filter((bs) => {
        return bs.player_type === "Back";
    })

    return (

        <>
            <FixtureHeadToHeadStats fixture={fixture} />
            <AthleteBoxScoreList boxScores={forwardsBoxScore} title="Fowards" fixture={fixture} />
            <AthleteBoxScoreList boxScores={backsBoxScore} title="Backs" teamName={fixture.away_team} fixture={fixture} />
            <FixtureKickingStats fixture={fixture} />
            <FixtureDisciplineStats fixture={fixture} />
        </>
    )
}
