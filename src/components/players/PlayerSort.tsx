import { ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';
import { athleteAnalytics } from '../../services/analytics/athleteAnalytics';
import { SortField, SortDirection } from '../../types/playerSorting';


interface PlayerSortProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField, direction: SortDirection) => void;
  variant?: 'dropdown' | 'inline';
}

export const PlayerSort = ({
  sortField,
  sortDirection,
  onSort,
  variant = 'dropdown',
}: PlayerSortProps) => {
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleOnSort = useCallback(
    (field: SortField, direction: SortDirection) => {
      athleteAnalytics.trackPlayerSortApplied(field, direction);
      onSort(field, direction);
    },
    [onSort]
  );

  return (
    <div className="relative">
      {variant === 'dropdown' && (
        <button
          onClick={() => setShowSortOptions(!showSortOptions)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800/40 rounded-lg text-gray-600 dark:text-gray-300 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="m21 8-4-4-4 4" />
            <path d="M17 4v16" />
          </svg>
          Sort
          <ChevronDown
            size={20}
            className={`transform transition-transform ${showSortOptions ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* Sort Options Dropdown */}
      {showSortOptions && variant === 'dropdown' && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg z-50 border dark:border-slate-700">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
              Sort by
            </h3>
            <button
              onClick={() => {
                handleOnSort('power_rank_rating', 'desc');
                setShowSortOptions(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'power_rank_rating' && sortDirection === 'desc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Power Ranking (High to Low)
            </button>
            <button
              onClick={() => {
                handleOnSort('power_rank_rating', 'asc');
                setShowSortOptions(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'power_rank_rating' && sortDirection === 'asc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Power Ranking (Low to High)
            </button>
            <button
              onClick={() => {
                handleOnSort('player_name', 'asc');
                setShowSortOptions(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'player_name' && sortDirection === 'asc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Name (A-Z)
            </button>
            <button
              onClick={() => {
                handleOnSort('player_name', 'desc');
                setShowSortOptions(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'player_name' && sortDirection === 'desc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Name (Z-A)
            </button>

            <button
              onClick={() => {
                handleOnSort('form', 'desc');
                setShowSortOptions(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'form' && sortDirection === 'desc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Form (High to Low)
            </button>

            <button
              onClick={() => {
                handleOnSort('form', 'asc');
                setShowSortOptions(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'form' && sortDirection === 'asc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Form (Low to High)
            </button>
          </div>
        </div>
      )}

      {/* Inline panel for bottom sheet */}
      {variant === 'inline' && (
        <div className="w-full bg-white dark:bg-dark-800 rounded-lg border dark:border-slate-700">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
              Sort by
            </h3>
            <button
              onClick={() => {
                handleOnSort('power_rank_rating', 'desc');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'power_rank_rating' && sortDirection === 'desc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Power Ranking (High to Low)
            </button>
            <button
              onClick={() => {
                handleOnSort('power_rank_rating', 'asc');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'power_rank_rating' && sortDirection === 'asc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Power Ranking (Low to High)
            </button>
            <button
              onClick={() => {
                handleOnSort('player_name', 'asc');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'player_name' && sortDirection === 'asc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Name (A-Z)
            </button>
            <button
              onClick={() => {
                handleOnSort('player_name', 'desc');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'player_name' && sortDirection === 'desc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Name (Z-A)
            </button>

            <button
              onClick={() => {
                handleOnSort('form', 'desc');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'form' && sortDirection === 'desc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Form (High to Low)
            </button>

            <button
              onClick={() => {
                handleOnSort('form', 'asc');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                sortField === 'form' && sortDirection === 'asc'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              Form (Low to High)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
