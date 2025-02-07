import React from 'react';

interface TeamStatsProps {
  league: {
    name: string;
    prizePool: string;
  };
  currentBudget: number;
  selectedPlayersCount: number;
}

export function TeamStats({ league, currentBudget, selectedPlayersCount }: TeamStatsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">League</span>
        <span className="font-semibold dark:text-gray-100">{league.name}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">Prize Pool</span>
        <span className="font-semibold text-green-600 dark:text-green-500">{league.prizePool}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">Budget Remaining</span>
        <span className={`font-bold text-lg ${currentBudget < 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
          {currentBudget} points
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-400">Players Selected</span>
        <span className="font-bold text-lg dark:text-gray-100">{selectedPlayersCount}/15</span>
      </div>
    </div>
  );
}