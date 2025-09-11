import useSWR from "swr";
import { fantasyAthleteService } from "../../services/fantasy/fantasyAthleteService";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { PlayerGameCard } from "../player/PlayerGameCard";
import { twMerge } from "tailwind-merge";

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

  const key = `/fantasy-team/${player.team_id}/athlete-points-breakdown/${player.id}`
  const { data: pointItems, isLoading } = useSWR(key, () => fantasyAthleteService.getRoundPointsBreakdown(
    player.athlete_id,
    round.start_round ?? 0,
    round.season_id
  ));

  const totalPoints = pointItems?.reduce((prev, curr) => {
    return prev + (curr.score ?? 0);
  }, 0) ?? 0;

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
      )} >{Math.floor(totalPoints)}</p>}

      {isLoading && <p className={twMerge(
        'text-white font-bold w-3 h-3 rounded-full animate-pulse bg-white/50',
        pointsClassName
      )} ></p>}
    </div>
  )
}