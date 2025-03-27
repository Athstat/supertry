import React from "react";
import { Users, Lock, Unlock, ChevronRight } from "lucide-react";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { motion } from "framer-motion";

interface AvailableLeagueCardProps {
  league: IFantasyLeague;
  onJoinLeague: (league: IFantasyLeague) => void;
  cardVariants: any;
  isAlreadyJoined?: boolean;
  custom?: number;
}

export function AvailableLeagueCard({
  league,
  onJoinLeague,
  cardVariants,
  isAlreadyJoined = false,
  custom = 0,
}: AvailableLeagueCardProps) {
  // Helper function to format entry fee
  const formatEntryFee = (fee: number | null): string => {
    if (fee === null || fee === 0) return "Free";
    return `$${fee}`;
  };

  // Helper function to format prize pool
  const formatPrizePool = (league: IFantasyLeague): string => {
    if (league.reward_description) return league.reward_description;
    return league.reward_type === "cash"
      ? `$${league.entry_fee || 0 * 10}`
      : "N/A";
  };

  // Button text based on joined status
  const buttonText = isAlreadyJoined ? "Already Joined" : "Join Now";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={custom}
      variants={cardVariants}
      className="bg-white dark:bg-dark-800/40 rounded-xl p-6 hover:shadow-md transition-all shadow-sm dark:shadow-dark-sm"
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
            {league.participants_count && league.max_participants && (
              <>
                <span className="mx-1">•</span>
                <span>
                  {league.participants_count}/{league.max_participants} players
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {league.is_private ? (
            <Lock size={16} className="text-gray-400 dark:text-gray-500" />
          ) : (
            <Unlock size={16} className="text-gray-400 dark:text-gray-500" />
          )}
          <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
            Open
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
        <div className="flex items-center gap-2">
          {/* <div className="text-right mr-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Entry Fee
            </div>
            <div className="font-semibold dark:text-gray-200">
              {formatEntryFee(league.entry_fee)}
            </div>
          </div> */}
          <button
            onClick={() => !isAlreadyJoined && onJoinLeague(league)}
            disabled={isAlreadyJoined}
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-1 transition-colors ${
              isAlreadyJoined
                ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
            aria-label={
              isAlreadyJoined
                ? `Already joined ${league.title}`
                : `Join league ${league.title}`
            }
          >
            {buttonText}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
