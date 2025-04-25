import React from "react";
import { Star } from "lucide-react";

interface TeamNameInputProps {
  teamName: string;
  setTeamName: (name: string) => void;
  isFavorite: boolean;
  setIsFavorite: (isFavorite: boolean) => void;
}

export const TeamNameInput: React.FC<TeamNameInputProps> = ({
  teamName,
  setTeamName,
  isFavorite,
  setIsFavorite,
}) => {
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="teamName"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Team Name
      </label>
      <div className="relative">
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={handleTeamNameChange}
          placeholder="Enter a catchy team name..."
          className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800/40 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-white"
          tabIndex={0}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <button
            onClick={handleToggleFavorite}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            tabIndex={0}
          >
            <Star
              size={20}
              className={`${
                isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
