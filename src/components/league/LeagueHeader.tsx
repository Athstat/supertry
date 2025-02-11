import React from "react";
import { Shield, Settings } from "lucide-react";

interface LeagueInfo {
  name: string;
  type: string;
  currentGameweek: number;
  totalGameweeks: number;
  totalTeams: number;
  prizePool: string;
}

interface LeagueHeaderProps {
  leagueInfo: LeagueInfo;
  onOpenSettings: () => void;
}

export function LeagueHeader({
  leagueInfo,
  onOpenSettings,
}: LeagueHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {leagueInfo.name}
            </h1>
            <div className="flex items-center gap-2 text-primary-100 mt-1">
              <Shield size={16} />
              <span>{leagueInfo.type} League</span>
              {/* <span className="mx-2">•</span>
              <span>Gameweek {leagueInfo.currentGameweek}</span> */}
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Total Teams</div>
            <div className="text-xl font-bold">{leagueInfo.totalTeams}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Prize Pool</div>
            <div className="text-xl font-bold">{leagueInfo.prizePool}</div>
          </div>
          {/* <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Gameweek</div>
            <div className="text-xl font-bold">
              {leagueInfo.currentGameweek}/{leagueInfo.totalGameweeks}
            </div>
          </div> */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Your Rank</div>
            <div className="text-xl font-bold">#3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
