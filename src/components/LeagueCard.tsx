import React from "react";
import { Users, Circle, Trophy } from "lucide-react";

interface LeagueCardProps {
  name: string;
  entryFee: string;
  prizePool: string;
  players: number;
  status: "live" | "joining" | "ended";
  onJoin?: () => void;
}

export function LeagueCard({
  name,
  entryFee,
  prizePool,
  players,
  status,
  onJoin,
}: LeagueCardProps) {
  const statusColors = {
    live: "text-green-500",
    joining: "text-blue-500",
    ended: "text-gray-500",
  };

  return (
    <div
      className="p-4 rounded-xl 
      bg-gray-700/20 dark:bg-dark-800/40 hover:bg-gray-700/30 dark:hover:bg-dark-800/60
      transition-all duration-200 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold dark:text-gray-100">{name}</h3>
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap
          backdrop-blur-sm
          ${
            status === "live"
              ? "bg-green-500/20 text-green-400 dark:bg-green-400/10"
              : "bg-blue-500/20 text-blue-400 dark:bg-blue-400/10"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Users size={16} className="shrink-0" />
          <span>
            {players}/{league.maxPlayers}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy size={16} className="shrink-0" />
          <span className="font-medium text-primary-300">{prizePool}</span>
        </div>
      </div>
    </div>
  );
}
