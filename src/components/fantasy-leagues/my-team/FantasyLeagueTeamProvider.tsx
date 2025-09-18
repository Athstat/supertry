import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"

type Props = {
    team: IFantasyTeamAthlete
}

export default function FantasyLeagueTeamProvider({team}: Props) {
  return (
    <div>FantasyLeagueTeamProvider</div>
  )
}


function InnerProvider({team} : Props) {

}