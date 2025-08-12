import { IProAthlete } from "../../../../types/athletes";
import { usePlayerData } from "../../provider/PlayerDataProvider";

type Props = {
  player: IProAthlete;
}

export default function PlayerStatsTab({ player }: Props) {

  const {sortedSeasons} = usePlayerData();

  return (
    <div>

    </div>
  )
}