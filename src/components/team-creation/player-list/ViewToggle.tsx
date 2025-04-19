import React from "react";
import { Grid, List } from "lucide-react";

export type ViewMode = "card" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
}) => {
  const handleToggleView = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white/50 dark:bg-dark-900/30 backdrop-blur-sm p-0.5">
      <button
        onClick={() => handleToggleView("card")}
        className={`flex items-center justify-center p-2 rounded transition-all ${
          viewMode === "card"
            ? "bg-primary-500 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
        }`}
        aria-label="Card view"
        aria-pressed={viewMode === "card"}
      >
        <Grid size={18} />
      </button>
      <button
        onClick={() => handleToggleView("list")}
        className={`flex items-center justify-center p-2 rounded transition-all ${
          viewMode === "list"
            ? "bg-primary-500 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
        }`}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
      >
        <List size={18} />
      </button>
    </div>
  );
};
