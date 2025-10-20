import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { PlayerGameCard } from "../player/PlayerGameCard";
import { twMerge } from "tailwind-merge";
import { useAthleteRoundScore } from "../../hooks/useAthletePointsBreakdown";

type TeamPlayerCardProp = {
  player: IFantasyTeamAthlete,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void,
  round: IFantasyLeagueRound,
  pointsClassName?: string
}

export function FantasyTeamAthleteCard({ player, onPlayerClick, round, pointsClassName }: TeamPlayerCardProp) {

  const handlePlayerClick = () => {
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  }

  const {score, isLoading} = useAthleteRoundScore(player.tracking_id, round.season_id, round.start_round ?? 0);
  const totalPoints = score ?? 0;

  return (
    <div className='flex flex-col items-center justify-start' >

      <PlayerGameCard
        key={player.id}
        player={player}
        onClick={handlePlayerClick}
        className="max-h-[230px]"
      />

      {!isLoading && <p className={twMerge(
        'text-white h-3 font-bold',
        pointsClassName
      )} >{(totalPoints).toFixed(1)}</p>}

      {isLoading && <p className={twMerge(
        'text-white font-bold w-3 h-3 rounded-full animate-pulse bg-white/50',
        pointsClassName
      )} ></p>}
    </div>
  )
}