import React from "react";
import { Plus, Search } from "lucide-react";

interface LeagueActionsProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateLeague: () => void;
  onJoinPrivate: () => void;
}

export function LeagueActions({
  searchTerm,
  onSearchChange,
  onCreateLeague,
  onJoinPrivate,
}: LeagueActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <button
        onClick={onCreateLeague}
        className="flex font-bold items-center justify-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-xl hover:bg-primary-700 transition-colors"
        aria-label="Create private league"
      >
        <Plus size={20} />
        Create Private League
      </button>
      <div className="relative">
        <input
          type="text"
          placeholder="Search leagues or enter code"
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full px-6 py-4 rounded-xl border border-gray-200 dark:border-dark-600 dark:bg-dark-850 dark:text-gray-100 dark:placeholder-gray-400 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          aria-label="Search leagues"
        />
        <button
          onClick={onJoinPrivate}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
          aria-label="Search leagues"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
