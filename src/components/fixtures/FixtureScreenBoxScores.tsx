import { IFixture } from "../../types/games"
import { fixtureSumary } from "../../utils/fixtureUtils"
import { IBoxScore } from "../../types/boxScore"
import FixtureHeadToHeadStats from "./FixtureHeadToHeadStats"
import FixtureAttackingLeaders from "./FixtureAttackingLeaders"
import FixtureDefensiveLeaders from "./FixtureDefensiveLeaders"

type Props = {
    fixture: IFixture,
    boxScore: IBoxScore[]
}

export default function FixtureScreenBoxScores({ fixture, boxScore }: Props) {

    const { gameKickedOff } = fixtureSumary(fixture);

    if (!gameKickedOff) return;

    return (

        <>
            <FixtureHeadToHeadStats boxScore={boxScore} fixture={fixture} />
            <FixtureAttackingLeaders boxScores={boxScore} fixture={fixture} />
            <FixtureDefensiveLeaders boxScores={boxScore} fixture={fixture} />
            {/* <AthleteBoxScoreList boxScores={backsBoxScore} title="Backs" teamName={fixture.away_team} fixture={fixture} /> */}
            {/* <FixtureKickingStats fixture={fixture} /> */}
            {/* <FixtureDisciplineStats fixture={fixture} /> */}
        </>
    )
}
