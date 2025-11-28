import { IFixture } from "../../../types/games"
import FixtureTeamStats from "./FixtureTeamStats"

type Props = {
    fixture: IFixture
}

export default function FixtureH2HTab({ fixture }: Props) {


    return (
        <div>



            <FixtureTeamStats 
                fixture={fixture}
            />


        </div>
    )
}


