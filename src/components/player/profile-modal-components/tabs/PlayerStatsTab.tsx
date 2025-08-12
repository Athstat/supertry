import { Activity } from "lucide-react";
import { IProAthlete } from "../../../../types/athletes";
import NoContentCard from "../../../shared/NoContentMessage";
import PlayerSeasonStatsCard from "../../PlayerSeasonStatsCard";
import { usePlayerData } from "../../provider/PlayerDataProvider";
import PlayerIconsRow from "../../../players/compare/PlayerIconsRow";

type Props = {
  player: IProAthlete;
}

export default function PlayerStatsTab({ player }: Props) {

  const { sortedSeasons, currentSeason } = usePlayerData();

  return (
    <div className="flex flex-col gap-4" >

      <div className="flex flex-row items-center gap-2" >
        <Activity className="w-4 h-4" />
        <p className="font-bold" >Career Stats</p>
      </div>

      {currentSeason && (
        <PlayerIconsRow 
          player={player}
          season={currentSeason}
          size="sm"
        />
      )}

      {sortedSeasons.length === 0 && (
        <NoContentCard
          message={`Career stats for ${player.player_name} are not available`}
        />
      )}

      {sortedSeasons.length > 0 && <div className="flex flex-col gap-4" >
        {sortedSeasons.map((s) => {
          return <PlayerSeasonStatsCard 
            player={player}
            season={s}
            key={s.id}
            hideTitle
          />
        })}
      </div>}
    </div>
  )
}