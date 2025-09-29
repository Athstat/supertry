import { useAthlete } from "../../../../hooks/athletes/useAthlete";
import { GameSportAction } from "../../../../types/boxScore";
import RoundedCard from "../../../shared/RoundedCard";

type StatLeaderProps = {
  leader: GameSportAction
}

export function StatLeaderCard({ leader }: StatLeaderProps) {

  const { athlete_id } = leader;
  const { athlete, isLoading } = useAthlete(athlete_id);

  if (isLoading) {
    return (
      <RoundedCard
        className="h-[60px] border-none animate-pulse"
      />
    )
  }

  if (!athlete) return null;

  return (
    <div className="flex items-center gap-4 bg-blue-700 border border-slate-800/40 rounded-xl p-4">

      {/* Player image */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-900">
          <img
            src={athlete.image_url}
            alt={athlete.player_name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Player info */}
      <div className="flex-1">
        <div className="text-base font-semibold text-white">
          {athlete.player_name}
        </div>
        <div className="text-xs text-white/80">
          {athlete.team?.athstat_name}
        </div>
      </div>

      {/* Stat value */}
      <div className="text-right">
        <div className="text-lg font-bold text-white">
          {Math.floor(leader.action_count)}
        </div>
        <div className="text-xs text-white/90 tracking-wide">
          {leader.definition?.display_name}
        </div>
      </div>
    </div>
  )
}