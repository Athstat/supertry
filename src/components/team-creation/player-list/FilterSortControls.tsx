import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";

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

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleFilterClick}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-gray-200"
        aria-label="Filter players"
        tabIndex={0}
      >
        <Filter size={16} />
        Filter
      </button>
      <button
        onClick={handleSortClick}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-gray-200"
        aria-label="Sort players"
        tabIndex={0}
      >
        <ArrowUpDown size={16} />
        Sort
      </button>

      {(positionFilter || teamFilter) && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
          aria-label="Clear filters"
          tabIndex={0}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
