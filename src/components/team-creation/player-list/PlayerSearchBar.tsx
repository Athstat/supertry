import React from "react";
import { Search, X } from "lucide-react";

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

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input w-full pl-10 pr-9 py-2 border dark:border-slate-700/50 rounded-lg 
          bg-white/10 dark:bg-slate-800/30 
          text-gray-900 dark:text-gray-100 
          backdrop-blur-md
          focus:ring-2 focus:ring-primary-500/70 dark:focus:ring-slate-500/70
          placeholder-gray-500 dark:placeholder-gray-400"
        aria-label="Search players"
        tabIndex={0}
      />
      {searchQuery && (
        <button
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
