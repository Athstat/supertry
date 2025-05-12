import { IFixture } from "../../types/games"
import { fixtureSumary } from "../../utils/fixtureUtils"
import { IBoxScoreItem } from "../../types/boxScore"
import FixtureAttackingLeaders from "./FixtureAttackingLeaders"
import FixtureDefensiveLeaders from "./FixtureDefensiveLeaders"
import FixtureKickingLeaders from "./FixtureKickingLeaders"
import FixtureDisciplineLeaders from "./FixtureDisciplineLeaders"
import { useState } from "react"
import AthletesSearchBar from "./AthletesSearchBar"
import FixtureSearchResults from "./FixtureSearchResults"

type Props = {
    fixture: IFixture,
    boxScore: IBoxScoreItem[]
}

export default function FixtureAthleteStats({ fixture, boxScore }: Props) {

    const { gameKickedOff } = fixtureSumary(fixture);
    const [search, setSearch] = useState<string>("");

    if (!gameKickedOff) return;

    return (

        <div className="flex flex-col gap-3 w-full" >

            <AthletesSearchBar value={search} onChange={setSearch} />
            { !search && <>
                <section id="attacking" ></section>
                <FixtureAttackingLeaders boxScores={boxScore} fixture={fixture} />
                <section id="defense" ></section>
                <FixtureDefensiveLeaders boxScores={boxScore} fixture={fixture} />
                <section id="kicking" ></section>
                <FixtureKickingLeaders boxScores={boxScore} fixture={fixture} />
                <section id="descipline" ></section>
                <FixtureDisciplineLeaders boxScores={boxScore} fixture={fixture} />
            </>}

            {search && <FixtureSearchResults 
                boxScore={boxScore}
                search={search} 
                fixture={fixture}
            />}
        </div>
    )
}
