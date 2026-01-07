import { useState } from "react"
import { IFixture } from "../../../../types/games"
import FixtureTeamSelector from "../../boxscore/FixtureTeamSelector"
import { IProTeam } from "../../../../types/team"
import { TeamRosterPitchView } from "./TeamRosterPitchView"

type Props = {
    fixture: IFixture
}

export default function FixtureRostersTab({ fixture }: Props) {

    const [team, setTeam] = useState<IProTeam | undefined>(fixture?.team);

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center justify-between" >
                <div>
                    {/* <ToggleButton /> */}
                </div>
            </div>

            <div className="flex px-4   flex-col items-center justify-center" >
                <FixtureTeamSelector
                    fixture={fixture}
                    className="w-[70%]"
                    value={team}
                    onChange={setTeam}
                />
            </div>

            {team && <TeamRosterPitchView
                team={team}
                fixture={fixture}
            />}

        </div>
    )
}

