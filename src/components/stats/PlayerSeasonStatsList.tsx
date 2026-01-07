import { IProAthlete } from "../../types/athletes"
import { IProSeason } from "../../types/season"

type Props = {
  season: IProSeason,
  player: IProAthlete
}

// Renders a sheet view with a player season stats
export default function PlayerSeasonStatsList({season, player} : Props) {
  return (
    <div>
      PlayerSeasonStats
      <p>{season.name}</p>
      <p>{player.player_name}</p>
    </div>
  )
}
