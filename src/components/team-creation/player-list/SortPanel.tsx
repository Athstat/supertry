import React from "react";
import { X } from "lucide-react";

interface SortPanelProps {
  setShowSort: (show: boolean) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
}

const sortOptions = [
  { id: "power_rank_rating", label: "Power Ranking" },
  { id: "player_name", label: "Player Name" },
  { id: "price", label: "Price" },
  { id: "attack", label: "Attack Rating" },
  { id: "defense", label: "Defense Rating" },
  { id: "kicking", label: "Kicking Rating" },
];

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
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSort(option.id)}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
              sortField === option.id
                ? "bg-primary-100 text-primary-800 dark:bg-slate-600 dark:text-gray-100"
                : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
            }`}
            aria-label={`Sort by ${option.label.toLowerCase()} ${
              sortField === option.id
                ? sortDirection === "asc"
                  ? "ascending"
                  : "descending"
                : ""
            }`}
            aria-pressed={sortField === option.id}
            tabIndex={0}
          >
            {option.label.split(" ")[0]}
            {sortField === option.id && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
