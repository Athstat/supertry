import React from "react";
import { Star } from "lucide-react";

interface TeamHeaderProps {
  teamName: string;
  setTeamName: (name: string) => void;
  isFavorite: boolean;
  setIsFavorite: (favorite: boolean) => void;
}

export function TeamHeader({
  teamName,
  setTeamName,
  isFavorite,
  setIsFavorite,
}: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-700 dark:border-dark-800">
      <div className="flex-1">
        <label
          htmlFor="teamName"
          className="block text-sm text-gray-600 dark:text-gray-400 mb-1"
        >
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          placeholder="Enter your team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 bg-white dark:bg-dark-850 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className={`mt-6 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 ${
          isFavorite ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"
        }`}
      >
        <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
