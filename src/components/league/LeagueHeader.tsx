import React, { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeagueInfo {
  name: string;
  type: string;
  currentGameweek: number;
  totalGameweeks: number;
  totalTeams: number;
  prizePool: string;
  userRank?: number;
}

interface LeagueHeaderProps {
  leagueInfo: LeagueInfo;
  onOpenSettings: () => void;
  isLoading?: boolean;
  children?: ReactNode;
}

export function LeagueHeader({
  leagueInfo,
  onOpenSettings,
  isLoading = false,
  children,
}: LeagueHeaderProps) {
  const navigate = useNavigate();

  console.log("leagueInfo", leagueInfo);

  return (
    <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => navigate("/leagues")}
              className="flex items-center text-primary-100 hover:text-white mb-2 transition-colors"
              aria-label="Back to leagues"
            >
              <ChevronLeft size={20} />
              <span>Back to leagues</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">
              {leagueInfo.name}
            </h1>
          </div>
          {children}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Total Teams</div>
            <div className="text-xl font-bold">
              {isLoading ? "..." : leagueInfo.totalTeams}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Your Rank</div>
            <div className="text-xl font-bold">
              {isLoading
                ? "..."
                : leagueInfo.userRank
                ? `#${leagueInfo.userRank}`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
