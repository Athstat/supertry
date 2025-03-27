import React from "react";
import { Users, Lock, Unlock, ChevronRight } from "lucide-react";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { motion } from "framer-motion";

interface MyLeagueCardProps {
  league: IFantasyLeague;
  onViewLeague: (league: IFantasyLeague) => void;
  cardVariants: any;
  custom?: number;
}

export function MyLeagueCard({
  league,
  onViewLeague,
  cardVariants,
  custom = 0,
}: MyLeagueCardProps) {
  // Helper function to format prize pool
  const formatPrizePool = (league: IFantasyLeague): string => {
    if (league.reward_description) return league.reward_description;
    return league.reward_type === "cash"
      ? `$${league.entry_fee || 0 * 10}`
      : "N/A";
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={custom}
      variants={cardVariants}
      className="bg-white dark:bg-dark-800/40 rounded-xl p-6 border-l-4 border-primary-500 hover:shadow-md transition-all shadow-sm dark:shadow-dark-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold dark:text-gray-100">
              {league.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users size={16} />
            <span>{league.duration_type} league</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {league.is_private ? (
            <Lock size={16} className="text-gray-400 dark:text-gray-500" />
          ) : (
            <Unlock size={16} className="text-gray-400 dark:text-gray-500" />
          )}
          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
            {league.has_ended ? "Ended" : "Active"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {league.reward_type === "cash" ? "Prize Pool" : "Reward"}
          </div>
          <div className="font-semibold text-green-600 dark:text-green-500">
            {formatPrizePool(league)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewLeague(league)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-1"
            aria-label={`View league ${league.title}`}
          >
            View League
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
