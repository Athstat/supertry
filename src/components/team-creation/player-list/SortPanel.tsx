import React from "react";
import { X } from "lucide-react";

interface SortPanelProps {
  setShowSort: (show: boolean) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
}

export const SortPanel: React.FC<SortPanelProps> = ({
  setShowSort,
  sortField,
  sortDirection,
  handleSort,
}) => {
  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg relative border dark:border-slate-700">
      <button
        onClick={() => setShowSort(false)}
        className="absolute top-3 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close sort panel"
        tabIndex={0}
      >
        <X size={20} />
      </button>

      <h3 className="text-sm font-medium mb-2 dark:text-gray-200">Sort By</h3>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSort("power_rank_rating")}
          className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
            sortField === "power_rank_rating"
              ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
              : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
          }`}
          aria-label={`Sort by rating ${
            sortField === "power_rank_rating"
              ? sortDirection === "asc"
                ? "ascending"
                : "descending"
              : ""
          }`}
          aria-pressed={sortField === "power_rank_rating"}
          tabIndex={0}
        >
          Rating
          {sortField === "power_rank_rating" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </button>

        <button
          onClick={() => handleSort("player_name")}
          className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
            sortField === "player_name"
              ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
              : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
          }`}
          aria-label={`Sort by name ${
            sortField === "player_name"
              ? sortDirection === "asc"
                ? "ascending"
                : "descending"
              : ""
          }`}
          aria-pressed={sortField === "player_name"}
          tabIndex={0}
        >
          Name
          {sortField === "player_name" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </button>

        <button
          onClick={() => handleSort("price")}
          className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
            sortField === "price"
              ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
              : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
          }`}
          aria-label={`Sort by price ${
            sortField === "price"
              ? sortDirection === "asc"
                ? "ascending"
                : "descending"
              : ""
          }`}
          aria-pressed={sortField === "price"}
          tabIndex={0}
        >
          Price
          {sortField === "price" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </button>
      </div>
    </div>
  );
};
