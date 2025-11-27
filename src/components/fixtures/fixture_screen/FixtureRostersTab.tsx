import { useState } from "react"
import { IFixture } from "../../../types/games"
import FixtureTeamSelector from "../boxscore/FixtureTeamSelector"
import { IProTeam } from "../../../types/team"
import RugbyPitch from "../../shared/RugbyPitch"

type Props = {
    fixture: IFixture
}

export default function FixtureRostersTab({ fixture }: Props) {

    const [team,] = useState<IProTeam | undefined>(fixture?.team);

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center justify-between" >
                <div>
                    {/* <ToggleButton /> */}
                </div>

                <div className="flex flex-row items-center gap-2" >
                    <p>List</p>
                    <p>Pitch</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center" >
                <FixtureTeamSelector
                    fixture={fixture}
                    className="w-full"
                />
            </div>

            {team && <TeamRosterPitchView 
                team={team}
                fixture={fixture}
            />}

        </div>
    )
}

type TeamRosterProps = {
    team: IProTeam,
    fixture: IFixture
}

function TeamRosterPitchView({team, fixture} : TeamRosterProps) {
    return (
        <div>
            <p>{team.athstat_name}</p>
            <p>{fixture.game_id}</p>
            <RugbyPitch />
        </div>
    )
}