import React from "react";
import { Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { LeagueCardProps } from "./types";

export function LeagueCard({
  league,
  onLeagueClick,
  teamCount,
  isLoading = false,
  custom = 0,
}: LeagueCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: custom * 0.1,
          },
        },
      }}
      onClick={() => onLeagueClick(league)}
      className="bg-gray-50 dark:bg-dark-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 },
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold dark:text-white">{league.title}</h3>
        <div
          className={`px-2 py-0.5 text-xs rounded-full ${
            league.is_open
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {league.is_open ? "Open" : "Closed"}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Users size={16} />
          <span>
            {teamCount !== undefined
              ? `${teamCount} teams joined`
              : "0 teams joined"}
          </span>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </motion.div>
  );
}
