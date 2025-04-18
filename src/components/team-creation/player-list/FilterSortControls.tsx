import React from "react";
import { Filter, ArrowUpDown, X } from "lucide-react";

interface FilterSortControlsProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showSort: boolean;
  setShowSort: (show: boolean) => void;
  positionFilter: string;
  teamFilter: string;
  clearFilters: () => void;
}

export const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  showFilters,
  setShowFilters,
  showSort,
  setShowSort,
  positionFilter,
  teamFilter,
  clearFilters,
}) => {
  const handleFilterClick = () => {
    setShowFilters(!showFilters);
    if (showSort) setShowSort(false);
  };

  const handleSortClick = () => {
    setShowSort(!showSort);
    if (showFilters) setShowFilters(false);
  };

  const filtersActive = positionFilter || teamFilter;

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleFilterClick}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors 
          ${
            showFilters
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              : "bg-white/10 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/60"
          }`}
        aria-label="Filter players"
        tabIndex={0}
      >
        <Filter size={14} className={showFilters ? "text-primary-500" : ""} />
        <span>Filter</span>
        {filtersActive && !showFilters && (
          <span className="flex items-center justify-center w-4 h-4 ml-1 text-xs rounded-full bg-primary-500 text-white">
            {(positionFilter ? 1 : 0) + (teamFilter ? 1 : 0)}
          </span>
        )}
      </button>

      <button
        onClick={handleSortClick}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors
          ${
            showSort
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              : "bg-white/10 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/60"
          }`}
        aria-label="Sort players"
        tabIndex={0}
      >
        <ArrowUpDown size={14} className={showSort ? "text-primary-500" : ""} />
        <span>Sort</span>
      </button>

      {filtersActive && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors ml-auto"
          aria-label="Clear filters"
          tabIndex={0}
        >
          <X size={14} />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
};
