import React from "react";
import { ChevronLeft, Users, Star, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamCreationHeaderProps {
  title: string;
  subTitle?: string;
  currentBudget: number;
  totalBudget: number;
  selectedPlayersCount: number;
  totalPositions: number;
  isFromWelcome?: boolean;
  isLocked?: boolean
}

export const TeamCreationHeader: React.FC<TeamCreationHeaderProps> = ({
  title,
  subTitle = "Select 6 players to build your dream rugby team",
  currentBudget,
  totalBudget,
  selectedPlayersCount,
  totalPositions,
  isFromWelcome,
  isLocked
}) => {
  const navigate = useNavigate();
  const isNegativeBudget = currentBudget < 0;

  const handleBackClick = () => {
    if (isFromWelcome) {
      navigate("/welcome");
    } else {
      navigate("/leagues");
    }
  };

  return (
    <div className="sticky top-[20px] z-20 bg-gray-50/95 dark:bg-dark-850/95 pt-4 pb-3 -mx-4 px-4 shadow-sm">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="flex items-center mb-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label={isFromWelcome ? "Back to welcome" : "Back to leagues"}
        tabIndex={0}
      >
        <ChevronLeft size={20} />
        <span className="font-medium">
          {isFromWelcome ? "Back to Welcome Screen" : "Back to Leagues"}
        </span>
      </button>

      {/* League Title Section */}
      <div className="mb-3">
        <h1 className="text-2xl flex flex-row items-center gap-1 sm:text-3xl font-bold mb-1 dark:text-gray-100">
          {isLocked && <Lock />}
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {subTitle}
        </p>
      </div>

      {/* Stats Section - Modern, clean design */}
      <div className="flex items-center justify-between gap-4 pt-2  border-gray-200 dark:border-gray-700/50">
        {/* Budget Display */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Budget
            </span>
            <Star size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <span
            className={`text-lg font-semibold flex items-center ${
              isNegativeBudget
                ? "text-red-500 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            <span>{currentBudget.toLocaleString()}</span>
          </span>
        </div>

        {/* Player Count */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Players
            </span>
            <Users size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              {selectedPlayersCount}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / {totalPositions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
