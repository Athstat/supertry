import React from "react";
import { Shield, Settings, ChevronLeft } from "lucide-react";
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
}

export function LeagueHeader({
  leagueInfo,
  onOpenSettings,
  isLoading = false,
}: LeagueHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white">
      <div className="container mx-auto px-4 py-6">
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
              {/* TODO: Update this to the actual league name */}
              {isLoading ? "Loading..." : "EPCR Challenge Cup - Quarter Finals"}
            </h1>
            <div className="flex items-center gap-2 text-primary-100 mt-3 mb-3 font-bold">
              <Shield size={16} />
              <span>{leagueInfo.type} League</span>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            aria-label="League settings"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Total Teams</div>
            <div className="text-xl font-bold">
              {isLoading ? "..." : leagueInfo.totalTeams}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Prize Pool</div>
            <div className="text-xl font-bold">
              {isLoading ? "..." : leagueInfo.prizePool}
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
