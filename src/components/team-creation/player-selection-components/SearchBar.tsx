import { Search } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SearchBarProps {
  searchQuery?: string;
  onSearchChange: (query: string) => void;
  className?: string,
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, className, placeholder }) => {
  return (
    <div className={twMerge(
      "dark:border-gray-700",
      className
    )}>
      <div className="relative">
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className='w-5 h-5' />
        </div>
        
        <input
          type="text"
          placeholder={placeholder || "Search players"}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

export default SearchBar;
