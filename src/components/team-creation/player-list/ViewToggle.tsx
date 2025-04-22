import React from "react";
import { LayoutGrid, ListIcon } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
}) => {
  const handleToggleGrid = () => setViewMode("grid");
  const handleToggleList = () => setViewMode("list");

  return (
    <div className="flex items-center bg-gray-100/80 dark:bg-slate-800/60 rounded-lg p-1 shadow-sm">
      <button
        onClick={handleToggleGrid}
        className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
        }`}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        tabIndex={0}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        onClick={handleToggleList}
        className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
        }`}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
        tabIndex={0}
      >
        <ListIcon size={18} />
      </button>
    </div>
  );
};
