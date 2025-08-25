import { IProAthlete } from "../../../../types/athletes"
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound, IFantasyLeagueTeam } from "../../../../types/fantasyLeague"

type Props = {
    athlete: IProAthlete,
    team: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
    round: IFantasyLeagueRound
}

export default function PlayerPointsBreakdownView({ }: Props) {



    return (
        <div>PlayerPointsBreakdownView</div>
    )
}
