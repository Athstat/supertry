import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"

type Props = {
    fixture: IFixture,
    teamName?: string,
}

export default function FixtureTeamAthleteStats({ teamName } : Props) {
  return (
    <TitledCard title={teamName} >
        
    </TitledCard>
  )
}
