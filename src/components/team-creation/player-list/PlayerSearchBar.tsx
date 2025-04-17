import React from "react";
import { Search } from "lucide-react";

interface PlayerSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PlayerSearchBar: React.FC<PlayerSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-4 py-2 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-slate-500"
        aria-label="Search players"
        tabIndex={0}
      />
    </div>
  );
};
