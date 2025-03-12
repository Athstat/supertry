import { Search } from "lucide-react";

interface PlayerSearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export const PlayerSearch = ({ searchQuery, onSearch }: PlayerSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800/40 border dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
      />
    </div>
  );
};
