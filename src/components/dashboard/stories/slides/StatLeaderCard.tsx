import { twMerge } from "tailwind-merge";
import { useAthlete } from "../../../../hooks/athletes/useAthlete";
import { GameSportAction } from "../../../../types/boxScore";
import RoundedCard from "../../../shared/RoundedCard";

type StatLeaderProps = {
  leader: GameSportAction,
  isDefense?: boolean,
  isKicking?: boolean
}

export function StatLeaderCard({ leader, isDefense = false, isKicking = false }: StatLeaderProps) {

  const { athlete_id } = leader;
  const { athlete, isLoading } = useAthlete(athlete_id);

  if (isLoading) {
    return (
      <RoundedCard
        className="h-[60px] border-none animate-pulse"
      />
    )
  }
  if (leader.action_count === 0) {return null;}
  if (!athlete) return null;



  return (
    <div className={twMerge(
      "flex items-center gap-4 bg-blue-700 border border-slate-800/40 rounded-xl p-4",
      isDefense && 'bg-red-600/80 border-none',
      isKicking && 'bg-violet-800 border-none'
    )}>

      {/* Player image */}
      <div className="relative">
        <div className={twMerge(
          "w-16 h-16 rounded-full overflow-hidden bg-blue-900",
          isDefense && 'bg-red-900',
          isKicking && 'bg-violet-500'
        )}>
          <img
            src={athlete.image_url}
            alt={athlete.player_name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Player info */}
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">
          {athlete.player_name}
        </div>
        <div className="text-[10px] text-white/80">
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