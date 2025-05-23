import { twMerge } from "tailwind-merge";
import { Player } from "../../types/team";
import { useFetch } from "../../hooks/useFetch";
import { athleteService } from "../../services/athleteService";
import { useState } from "react";
import { formatPosition } from "../../utils/athleteUtils";
import FormIndicator from "../shared/FormIndicator";
import TeamLogo from "./TeamLogo";
import { useTeamData } from "../my-team/TeamDataProvider";
import { Info } from "lucide-react";

type Props = {
  player: Player;
  onClick: () => void;
  className?: string;
};

type CardTier = "gold" | "silver" | "bronze" | "blue";

/** Renders a athlete fantasy card that is either gold, silver or 
 * bronze depending on the power ranking of the player */

export function AthleteFantasyCard({ player, onClick, className }: Props) {
  const [imageError, setIamgeError] = useState<string>();

  const { data: playerInfo, isLoading } = useFetch(
    "athletes",
    player.athlete_id,
    athleteService.getRugbyAthleteById
  );

  const { leagueInfo } = useTeamData();

  const { data: pointsBreakDown, isLoading: pointsLoading } = useFetch(
    "points-breakdown",

    {
      leagueId: leagueInfo?.official_league_id ?? "fallback-ofid",
      round: leagueInfo?.start_round ?? -1,
      trackingId: playerInfo?.tracking_id ?? "fallback-tid",
    },
    async ({ leagueId, round, trackingId }) => {
      return await athleteService.getAthletePointsBreakdownByLeagueAndRound(
        trackingId,
        round,
        leagueId ?? "fall-back"
      );
    }
  );

  if (isLoading)
    return (
      <div
        className={twMerge(
          "group relative bg-slate-800 animate-pulse rounded-lg flex flex-col h-[280px] w-[200px]",
          className
        )}
      />
    );

  if (!playerInfo) return <></>;

  const pr = playerInfo.power_rank_rating ?? 0;
  const cardTier: CardTier =
    pr <= 69 ? "bronze"
      : pr > 70 && pr < 80 ? "silver"
        : pr >= 90 ? "blue" : "gold";

  const statValue = (val: number) => Math.min(99, Math.max(0, Math.floor(val)));

  const totalPoints = pointsBreakDown
    ? pointsBreakDown.reduce((res, action) => {
      return res + action.score;
    }, 0)
    : 0;

  const isAvailable = playerInfo.available;

  return (
    <div className="">
      <div
        onClick={onClick}
        className={twMerge(
          "group relative shadow-xl rounded-lg flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden transform-style-3d",
          cardTier === "gold" &&
          "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 ",
          cardTier === "silver" &&
          "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600",
          cardTier === "bronze" &&
          "bg-gradient-to-br from-amber-600 via-amber-800 to-amber-900 text-white",
          cardTier === "blue" &&
          "bg-gradient-to-br from-purple-600 via-blue-800 to-purple-900 text-white",
          className
        )}
      >
        {!isAvailable && <div className="top-0 left-0 absolute w-full h-full bg-black/50 z-10" ></div>}
        {/* Team Logo */}
        <div className="absolute top-2 right-2 z-10">
          <TeamLogo className="w-8 h-8" url={playerInfo.team_logo} />
        </div>

        {/* Player Image */}
        <div className="relative flex-[3] overflow-hidden bg-gradient-to-b from-transparent to-black/20">
          {player.image_url && !imageError && (
            <img
              src={player.image_url}
              onError={() => setIamgeError("Image failed to load")}
              className="w-full object-scale-down object-top"
            />
          )}
        </div>

        {/* Player Details */}
        <div
          className={twMerge(
            "p-3  flex-[1] ",
            cardTier === "gold" && "bg-yellow-500/10",
            cardTier === "silver" && "bg-gray-500/10",
            cardTier === "bronze" && "bg-amber-900/10",
            cardTier === "blue" && "bg-blue-900/10",
          )}
        >
          {/* Player name and form */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs font-bold truncate flex-1">
              {player.player_name}
            </h3>
            {playerInfo.form &&
              (playerInfo.form === "UP" || playerInfo.form === "DOWN") && (
                <FormIndicator form={playerInfo.form} />
              )}
          </div>

          {/* Position and Rating */}
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="text-xs truncate">
              {formatPosition(player.position_class ?? "")}
            </div>
            <div className="text-xs font-medium flex flex-row items-center justify-end text-nowrap">PR {statValue(pr)}</div>
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

      {!pointsLoading && (
        <div className=" flex flex-row mt-2 gap-1 items-center justify-center">
          <p className="text-white font-medium">{totalPoints.toFixed(1)}</p>
          {!isAvailable && <div>
            <Info className="w-4 h-4 text-yellow-50" />
          </div>}
        </div>
      )}

      {pointsLoading && (
        <div className=" flex flex-row mt-2 items-center justify-center">
          <p className="bg-slate-400/40 rounded-xl w-4 h-4 animate-pulse"></p>
        </div>
      )}

    </div>
  );
}
