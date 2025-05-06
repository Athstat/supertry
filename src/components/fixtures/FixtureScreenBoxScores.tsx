import useSWR from "swr"
import { IFixture } from "../../types/games"
import FixtureHeadToHeadStats from "./FixtureHeadToHeadStats"
import { boxScoreService } from "../../services/boxScoreService"
import { LoadingState } from "../ui/LoadingState"
import { ErrorState } from "../ui/ErrorState"
import { fixtureSumary } from "../../utils/fixtureUtils"

type Props = {
    fixture: IFixture
}

export default function FixtureScreenBoxScores({ fixture }: Props) {

    const {data: boxscore, isLoading, error} = useSWR(fixture.game_id, boxScoreService.getBoxScoreByGameId);

    if (isLoading) return <LoadingState message="" />

    if (!boxscore || error) return <ErrorState message="Failed to fetch box score information" />

    const { gameKickedOff } = fixtureSumary(fixture);

    if (!gameKickedOff) return;

    return (

        <>
            <FixtureHeadToHeadStats fixture={fixture} />
            {/* <AthleteBoxScoreList boxScores={forwardsBoxScore} title="Fowards" fixture={fixture} /> */}
            {/* <AthleteBoxScoreList boxScores={backsBoxScore} title="Backs" teamName={fixture.away_team} fixture={fixture} /> */}
            {/* <FixtureKickingStats fixture={fixture} /> */}
            {/* <FixtureDisciplineStats fixture={fixture} /> */}
        </>
    )
}
