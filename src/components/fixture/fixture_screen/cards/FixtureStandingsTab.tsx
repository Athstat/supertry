import { IFixture } from "../../../../types/games"
import SeasonStandingsTable from "../../../seasons/SeasonStandingsTable"


type Props = {
    fixture: IFixture
}

export default function FixtureStandingsTab({fixture} : Props) {
  return (
    <div className="flex flex-col gap-2" >

        <SeasonStandingsTable 
            seasonId={fixture.league_id}
            highlightTeamIds={[fixture.team?.athstat_id ?? "", fixture.opposition_team?.athstat_id ?? ""]}
            showSeasonName
        />
    </div>
  )
}
