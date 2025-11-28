import { IFixture } from "../../../types/games"
import SeasonStandingsTable from "../../seasons/SeasonStandingsTable"
import { FixtureVotingCard } from "../voting/FixtureVotingCard"
import FixtureSeasonLeaders from "./FixtureSeasonLeaders"
import FixtureTeamStats from "./FixtureTeamStats"

type Props = {
    fixture: IFixture
}

export default function FixtureH2HTab({ fixture }: Props) {


    return (
        <div className="px-4 flex flex-col gap-4" >


            <FixtureTeamStats
                fixture={fixture}
            />

            <FixtureVotingCard
                fixture={fixture}
            />

            <SeasonStandingsTable
                seasonId={fixture.league_id}
                filterTeamIds={[fixture.team?.athstat_id ?? "", fixture.opposition_team?.athstat_id ?? ""]}
            />

            <FixtureSeasonLeaders
                fixture={fixture}
            />

        </div>
    )
}


