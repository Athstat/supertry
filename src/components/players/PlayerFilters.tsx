import { Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { IProTeam } from "../../types/team";
import TeamLogo from "../team/TeamLogo";
import { twMerge } from "tailwind-merge";
import { formatPosition } from "../../utils/athleteUtils";

interface PlayerFiltersProps {
  positionFilter: string;
  teamFilter?: IProTeam;
  availablePositions: string[];
  availableTeams: IProTeam[];
  onPositionFilter: (position: string) => void;
  onTeamFilter: (team: IProTeam) => void;
  onClearFilters: () => void;
}

export const PlayerFilters = ({
  positionFilter,
  teamFilter,
  availablePositions,
  availableTeams,
  onPositionFilter,
  onTeamFilter,
  onClearFilters,
}: PlayerFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800/40 rounded-lg text-gray-600 dark:text-gray-300 font-medium"
      >
        <Filter size={20} />
        Filters

        {(positionFilter || teamFilter) && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium text-white bg-primary-600 rounded-full">
            {(positionFilter ? 1 : 0) + (teamFilter ? 1 : 0)}
          </span>
        )}
        
        <ChevronDown
          size={20}
          className={`transform transition-transform ${
            showFilters ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className=" absolute left-0 mt-2 w-96 bg-white dark:bg-dark-800 rounded-lg shadow-lg z-30 border dark:border-slate-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Position Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position
            </h4>
            <div className="flex flex-wrap gap-2">
              {availablePositions.map((position) => (
                <button
                  key={position}
                  onClick={() => onPositionFilter(position)}

                  className={twMerge(
                    'px-3 py-1.5 text-sm rounded-full',
                    positionFilter === position ?
                    "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500"
                  )}
                >
                  {position && formatPosition(position)}
                </button>
              ))}
            </div>
          </div>

          {/* Team Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {availableTeams.map((team) => (
                <button
                  key={team.athstat_id}
                  onClick={() => onTeamFilter(team)}
                  className={`px-3 py-2 flex flex-row items-center gap-1 text-sm rounded-md text-left ${
                    teamFilter && teamFilter.athstat_id === team.athstat_id
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500"
                  }`}
                >
                  <TeamLogo 
                    teamName={team.athstat_name}
                    url={team.image_url}
                    className="w-4 h-4"
                  />
                  <p className="text-xs truncate" >
                    {team.athstat_name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};
