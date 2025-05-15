import { Shield, Pencil, Trophy, Star, Users, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IFantasyLeague,
  IFantasyLeagueTeam,
} from "../../../types/fantasyLeague";
import { isLeagueLocked } from "../../../utils/leaguesUtils";

type MyTeamSectionProps = {
  team: IFantasyLeagueTeam;
  rank: number;
  league: IFantasyLeague;
};

/** Renders a my team card */
export default function LeagueCardMyTeamSection({
  team,
  rank,
  league,
}: MyTeamSectionProps) {
  const navigate = useNavigate();
  const isLocked = isLeagueLocked(league.join_deadline);

  const handleClick = () => {
    navigate(`/my-team/${team.team_id}`);
  };

  // const totalTeamValue = team.athletes.reduce((prev, a) => {
  //     return prev += a.purchase_price;
  // }, 0);

  // Animation variants
  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="cursor-pointer w-full flex flex-col gap-3 dark:text-white">
      <p className="text-xl font-bold">My Team</p>

      <motion.div
        onClick={handleClick}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="bg-gradient-to-br from-primary-700 to-primary-700 via-primary-800 mb-6 text-white rounded-xl p-4 space-y-3 shadow-md"
      >
        {/* Team Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-white" />
            <h3 className="font-semibold text-md trucate lg:text-lg dark:text-gray-100">
              {team.team_name}
            </h3>
          </div>

          {!isLocked && (
            <button className="p-2 hover:bg-primary-900 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
              <Pencil className="w-5 h-5 text-white" />
            </button>
          )}

          {isLocked && (
            <button className="p-2 hover:bg-primary-800 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
              <Lock className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        <div className="text-white flex flex-row items-center">
          <div className="flex flex-row items-center gap-1">
            <Users className="w-4 h-4 text-white" />
            <p>Players {team.athletes.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rank Badge */}
          <div className="inline-flex items-center">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-white to-gray-200 via-gray-50 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-base mr-0.5">
                {rank === 1 ? (
                  "🥇"
                ) : rank === 2 ? (
                  "🥈"
                ) : rank === 3 ? (
                  "🥉"
                ) : (
                  <Trophy
                    size={18}
                    className="text-primary-600 dark:text-primary-400"
                  />
                )}
              </span>
              <span className="font-medium text-sm text-primary-800">
                Rank #{rank}
              </span>
            </div>
          </div>

          {/* Points Badge */}
          <div className="inline-flex items-center">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-white to-gray-200 via-gray-50 px-3 py-1.5 rounded-full shadow-sm">
              <Zap size={18} className="text-orange-500 shrink-0" />
              <span className="font-medium text-sm text-primary-800">
                {Math.floor(team.score ?? 0)} pts
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
