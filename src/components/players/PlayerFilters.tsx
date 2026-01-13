import { useState } from 'react';
import { IProTeam } from '../../types/team';
import TeamLogo from '../team/TeamLogo';
import { twMerge } from 'tailwind-merge';
import { formatPosition } from '../../utils/athleteUtils';
import { athleteAnalytics } from '../../services/analytics/athleteAnalytics';

interface PlayerFiltersProps {
  positionFilter: string;
  teamFilter?: IProTeam;
  availablePositions: string[];
  availableTeams: IProTeam[];
  onPositionFilter: (position: string) => void;
  onTeamFilter: (team: IProTeam) => void;
  onClearFilters: () => void;
  variant?: 'dropdown' | 'inline';
}

export const PlayerFilters = ({
  positionFilter,
  teamFilter,
  availablePositions,
  availableTeams,
  onPositionFilter,
  onTeamFilter,
  onClearFilters,
  variant = 'dropdown',
}: PlayerFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const closeIfDropdown = () => {
    if (variant === 'dropdown') setShowFilters(false);
  };

  return (
    <div className="">

      {/* Filters Dropdown */}
      {showFilters && variant === 'dropdown' && (
        <div className="left-0 w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg z-50 border dark:border-slate-700 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Filters</h3>
            <button
              onClick={() => {
                onClearFilters();
                setShowFilters(false);
              }}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Position Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</h4>
            <div className="flex flex-wrap gap-2">
              {availablePositions.map(position => (
                <button
                  key={position}
                  onClick={() => {
                    athleteAnalytics.trackPlayerFilterApplied('Position', position);
                    onPositionFilter(position);
                    closeIfDropdown();
                  }}
                  className={twMerge(
                    'px-3 py-1.5 text-sm rounded-full',
                    positionFilter === position
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500'
                  )}
                >
                  {position && formatPosition(position)}
                </button>
              ))}
            </div>
          </div>

          {/* Team Filter */}
          <div className="pb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team</h4>
            <div className="grid grid-cols-2 gap-2 max-h-60 pb-6">
              {availableTeams.map(team => (
                <button
                  key={team.athstat_id}
                  onClick={() => {
                    athleteAnalytics.trackPlayerFilterApplied('Team', team.athstat_id);
                    onTeamFilter(team);
                    closeIfDropdown();
                  }}
                  className={`px-3 py-2 flex flex-row items-center gap-1 text-sm rounded-md text-left ${
                    teamFilter && teamFilter.athstat_id === team.athstat_id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500'
                  }`}
                >
                  <TeamLogo teamName={team.athstat_name} url={team.image_url} className="w-4 h-4" />
                  <p className="text-xs truncate">{team.athstat_name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline panel for bottom sheet */}
      {variant === 'inline' && (
        <div className="w-full bg-white dark:bg-dark-800 rounded-lg border dark:border-slate-700 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Filters</h3>
            <button
              onClick={() => {
                onClearFilters();
              }}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Position Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</h4>
            <div className="flex flex-wrap gap-2">
              {availablePositions.map(position => (
                <button
                  key={position}
                  onClick={() => {
                    athleteAnalytics.trackPlayerFilterApplied('Position', position);
                    onPositionFilter(position);
                  }}
                  className={twMerge(
                    'px-3 py-1.5 text-sm rounded-full',
                    positionFilter === position
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500'
                  )}
                >
                  {position && formatPosition(position)}
                </button>
              ))}
            </div>
          </div>

          {/* Team Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team</h4>
            <div className="grid grid-cols-2 gap-2 pb-2">
              {availableTeams.map(team => (
                <button
                  key={team.athstat_id}
                  onClick={() => {
                    athleteAnalytics.trackPlayerFilterApplied('Team', team.athstat_id);
                    onTeamFilter(team);
                  }}
                  className={`px-3 py-2 flex flex-row items-center gap-1 text-sm rounded-md text-left ${
                    teamFilter && teamFilter.athstat_id === team.athstat_id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-500'
                  }`}
                >
                  <TeamLogo teamName={team.athstat_name} url={team.image_url} className="w-4 h-4" />
                  <p className="text-xs truncate">{team.athstat_name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
