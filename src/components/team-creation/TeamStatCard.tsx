import React from "react";
import { Zap } from "lucide-react";
import { TeamStats } from "./TeamStats";

interface TeamStatCardProps {
  league: any;
  leagueConfig: {
    team_budget: number;
    team_size: number;
    lineup_size: number;
  };
  currentBudget: number;
  selectedPlayersCount: number;
  totalPositions: number;
  onAutoGenerate: () => void;
}

export const TeamStatCard: React.FC<TeamStatCardProps> = ({
  league,
  leagueConfig,
  currentBudget,
  selectedPlayersCount,
  totalPositions,
  onAutoGenerate,
}) => {
  return (
    <div className="dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
      <TeamStats
        league={league}
        leagueConfig={leagueConfig}
        currentBudget={currentBudget}
        selectedPlayersCount={selectedPlayersCount}
        totalPositions={totalPositions}
      />

      <button
        onClick={onAutoGenerate}
        disabled={true}
        className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-5 cursor-not-allowed opacity-50"
        aria-label="Auto pick team (coming soon)"
        tabIndex={-1}
      >
        <Zap size={20} />
        Auto Pick Team
      </button>
    </div>
  );
};
