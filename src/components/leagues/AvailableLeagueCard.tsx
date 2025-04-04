import React from "react";
import { Users, Lock, Unlock, ChevronRight } from "lucide-react";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AvailableLeagueCardProps {
  league: IFantasyLeague;
  onJoinLeague: (league: IFantasyLeague) => void;
  onViewLeague: (league: IFantasyLeague) => void;
  cardVariants: any;
  isAlreadyJoined?: boolean;
  showBothButtons?: boolean;
  custom?: number;
}

export function AvailableLeagueCard({
  league,
  onJoinLeague,
  onViewLeague,
  cardVariants,
  isAlreadyJoined = false,
  showBothButtons = false,
  custom = 0,
}: AvailableLeagueCardProps) {
  const navigate = useNavigate();

  console.log("League: ", league);
  // Add a more reliable check for joined status
  const actuallyJoined =
    isAlreadyJoined &&
    (league.is_joined === true || league.user_has_joined === true);

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
  const buttonText = isAlreadyJoined ? "View League" : "Join Now";

  // Handle button click based on joined status
  const handleButtonClick = () => {
    if (isAlreadyJoined) {
      onViewLeague(league);
    } else {
      onJoinLeague(league);
    }
  };

  // Render buttons based on props
  const renderButtons = () => {
    if (showBothButtons) {
      return (
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onViewLeague(league)}
            className="w-full bg-transparent border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-lg font-medium hover:bg-primary-50/30 dark:hover:bg-primary-900/20 transition-colors flex items-center justify-center gap-1"
            aria-label={`View league ${league.title}`}
          >
            View League
          </button>
          <button
            onClick={() => onJoinLeague(league)}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
            aria-label={`Join league ${league.title}`}
          >
            Join Now
            <ChevronRight size={16} />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleButtonClick}
        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
        aria-label={
          isAlreadyJoined
            ? `View league ${league.title}`
            : `Join league ${league.title}`
        }
      >
        {buttonText}
        <ChevronRight size={16} />
      </button>
    );
  };

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

      <div className="flex flex-col mt-4">
        <div className="mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {league.reward_type === "cash" ? "Prize Pool" : "Reward"}
          </div>
          <div className="font-semibold text-green-600 dark:text-green-500">
            {formatPrizePool(league)}
          </div>
        </div>
        {renderButtons()}
      </div>
    </motion.div>
  );
}
