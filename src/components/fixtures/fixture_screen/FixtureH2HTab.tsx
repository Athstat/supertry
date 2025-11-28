import { IFixture } from "../../../types/games"
import FixtureSeasonLeaders from "./FixtureSeasonLeaders"
import FixtureTeamStats from "./FixtureTeamStats"

type Props = {
    fixture: IFixture
}

export default function FixtureH2HTab({ fixture }: Props) {


    return (
        <div className="px-4" >

            <FixtureTeamStats 
                fixture={fixture}
            />

            <FixtureSeasonLeaders 
                fixture={fixture}
            />

        </div>
    )
}


