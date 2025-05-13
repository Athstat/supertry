import { twMerge } from "tailwind-merge";
import { Player } from "../../types/team";
import { useFetch } from "../../hooks/useFetch";
import { athleteService } from "../../services/athleteService";
import { useState } from "react";
import { formatPosition } from "../../utils/athleteUtils";
import FormIndicator from "../shared/FormIndicator";
import TeamLogo from "./TeamLogo";
import { useAthletePointsBreakdown } from "../../hooks/useAthletePointsBreakdown";
import { useTeamData } from "../my-team/TeamDataProvider";

type Props = {
  player: Player,
  onClick: () => void,
  className?: string
}

type CardTier = "gold" | "silver" | "bronze"

export function TeamPlayerCard({ player, onClick, className }: Props) {
  const [imageError, setIamgeError] = useState<string>();
  const { data: playerInfo, isLoading } = useFetch("athletes", player.id, athleteService.getRugbyAthleteById);

  const { leagueInfo } = useTeamData();

  const { data: pointsBreakDown, isLoading: pointsLoading } = useFetch(
    "points-breakdown",

    {
      leagueId: leagueInfo?.official_league_id ?? "fallback-ofid",
      round: leagueInfo?.start_round ?? -1,
      trackingId: playerInfo?.tracking_id ?? "fallback-tid"
    }
    , async ({ leagueId, round, trackingId }) => {
      return await athleteService.getAthletePointsBreakdownByLeagueAndRound(
        trackingId, round, leagueId ?? "fall-back"
      )
    });

  if (isLoading) return (
    <div className={twMerge("group relative bg-slate-800 animate-pulse rounded-lg flex flex-col h-[280px] w-[200px]", className)} />
  );


  if (!playerInfo) return <></>;

  const pr = playerInfo.power_rank_rating ?? 0;
  const cardTier: CardTier = pr <= 60 ? "bronze" : pr > 60 && pr < 80 ? "silver" : "gold";

  const statValue = (val: number) => Math.min(99, Math.max(0, Math.floor(val)));

  const totalPoints = pointsBreakDown ?
    pointsBreakDown.reduce((res, action) => {
      return res + action.score
    }, 0) : 0;

  return (
    <div className="">
      <div
        onClick={onClick}
        className={twMerge(
          "group relative shadow-xl rounded-lg flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer transform-style-3d",
          cardTier === "gold" && "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600",
          cardTier === "silver" && "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600",
          cardTier === "bronze" && "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900",
          className
        )}
      >
        {/* Team Logo */}
        <div className="absolute top-2 right-2 z-10">
          <TeamLogo className="w-8 h-8" url={playerInfo.team_logo} />
        </div>

        {/* Player Image */}
        <div className="relative flex-[3] overflow-hidden bg-gradient-to-b from-transparent to-black/20">
          {player.image && !imageError && (
            <img
              src={player.image}
              onError={() => setIamgeError("Image failed to load")}
              className="w-full object-scale-down object-top"
            />
          )}
        </div>

        {/* Player Details */}
        <div className={twMerge(
          "p-3  flex-[1] ",
          cardTier === "gold" && "bg-yellow-500/10",
          cardTier === "silver" && "bg-gray-500/10",
          cardTier === "bronze" && "bg-amber-900/10",
        )}>
          {/* Player name and form */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs font-bold truncate flex-1">{player.name}</h3>
            {playerInfo.form && (playerInfo.form === "UP" || playerInfo.form === "DOWN") && (
              <FormIndicator form={playerInfo.form} />
            )}
          </div>

          {/* Position and Rating */}
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-xs">{formatPosition(player.position ?? "")}</span>
            <span className="text-xs font-medium">PR {statValue(pr)}</span>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="flex justify-between">
              <span>ATT</span>
              <span>{statValue(playerInfo.ball_carrying ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>DEF</span>
              <span>{statValue(playerInfo.tackling ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>KCK</span>
              <span>{statValue(playerInfo.points_kicking ?? 0)}</span>
            </div>
          </div> */}
        </div>
      </div>

      {!pointsLoading && <div className=" flex flex-row mt-2 items-center justify-center" >
        <p className="text-white font-medium" >{totalPoints.toFixed(1)}</p>
      </div>}

      {pointsLoading && <div className=" flex flex-row mt-2 items-center justify-center" >
        <p className="bg-slate-400/40 rounded-xl w-4 h-4 animate-pulse" ></p>
      </div>}


    </div>
  );
}
