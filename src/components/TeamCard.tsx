import React from "react";
import { Star, Users } from "lucide-react";

interface TeamCardProps {
  name: string;
  points: number;
  rank: number;
  players: number;
  isFavorite: boolean;
}

export function TeamCard({
  name,
  points,
  rank,
  players,
  isFavorite,
}: TeamCardProps) {
  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-200
        bg-gray-100/80 dark:bg-gray-800/40 
        border border-gray-200/60 dark:border-gray-700/40 
        hover:bg-gray-200/80 dark:hover:bg-gray-800/60
        shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
        backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {name}
        </h3>
        <button
          className={`transition-colors duration-200 ${
            isFavorite
              ? "text-yellow-500"
              : "text-gray-400 hover:text-yellow-500 dark:text-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded-full p-1`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400">
          <Users size={16} className="opacity-80" />
          <span className="font-medium">{players} players</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-gray-500 dark:text-gray-500 text-xs">
              Points
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {points}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 dark:text-gray-500 text-xs">
              Rank
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              #{rank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
