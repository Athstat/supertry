import React from "react";
import { X } from "lucide-react";

interface FilterPanelProps {
  setShowFilters: (show: boolean) => void;
  availablePositions: string[];
  positionFilter: string;
  handlePositionFilter: (position: string) => void;
  availableTeams: string[];
  teamFilter: string;
  handleTeamFilter: (team: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  setShowFilters,
  availablePositions,
  positionFilter,
  handlePositionFilter,
  availableTeams,
  teamFilter,
  handleTeamFilter,
}) => {
  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg relative border dark:border-slate-700">
      <button
        onClick={() => setShowFilters(false)}
        className="absolute top-3 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close filter panel"
        tabIndex={0}
      >
        <X size={20} />
      </button>

      <div className="mb-3">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-200">
          Position
        </h3>
        <div className="flex flex-wrap gap-2">
          {availablePositions.map((pos) => (
            <button
              key={pos}
              onClick={() => handlePositionFilter(pos)}
              className={`px-2 py-1 text-xs rounded-full ${
                positionFilter === pos
                  ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                  : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
              }`}
              aria-label={`Filter by position: ${pos}`}
              aria-pressed={positionFilter === pos}
              tabIndex={0}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 dark:text-gray-200">Team</h3>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          {availableTeams.map((team) => (
            <button
              key={team}
              onClick={() => handleTeamFilter(team)}
              className={`px-2 py-1 text-xs rounded-full ${
                teamFilter === team
                  ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                  : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
              }`}
              aria-label={`Filter by team: ${team}`}
              aria-pressed={teamFilter === team}
              tabIndex={0}
            >
              {team}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
