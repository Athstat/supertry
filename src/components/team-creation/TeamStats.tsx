import React from "react";

interface TeamStatsProps {
  league: {
    title: string;
    reward_description: string;
  };
  leagueConfig: {
    team_budget: number;
    team_size: number;
    lineup_size: number;
  };
  currentBudget: number;
  selectedPlayersCount: number;
  totalPositions: number;
}

export function TeamStats({
  league,
  leagueConfig,
  currentBudget,
  selectedPlayersCount,
  totalPositions,
}: TeamStatsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">League</span>
        <span className="font-semibold dark:text-gray-100">{league.title}</span>
      </div>

      {league.reward_description && (
        <div className="flex flex-col">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Reward
          </span>
          <span className="font-semibold text-green-600 dark:text-green-500">
            {league.reward_description}
          </span>
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Budget Remaining
        </span>
        <span
          className={`font-bold text-lg ${
            currentBudget < 0
              ? "text-red-600 dark:text-red-500"
              : "text-green-600 dark:text-green-500"
          }`}
        >
          {currentBudget} points
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Players Selected
        </span>
        <span className="font-bold text-lg dark:text-gray-100">
          {selectedPlayersCount}/{leagueConfig.lineup_size}
        </span>
      </div>
    </div>
  );
}
