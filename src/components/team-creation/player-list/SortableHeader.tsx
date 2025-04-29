import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

interface SortableHeaderProps {
  title: string;
  sortField: string;
  currentSortField: string | null;
  currentSortDirection: SortDirection;
  onSort: (field: string) => void;
  className?: string;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  title,
  sortField,
  currentSortField,
  currentSortDirection,
  onSort,
  className = "",
}) => {
  const isActive = currentSortField === sortField;

  const handleClick = () => {
    onSort(sortField);
  };

  return (
    <th
      onClick={handleClick}
      className={`
        font-medium text-xs py-2 px-1 text-center cursor-pointer
        transition-colors duration-150 relative h-10
        active:bg-gray-100 dark:active:bg-dark-800
        ${
          isActive
            ? "text-primary-600 dark:text-primary-400"
            : "text-gray-600 dark:text-gray-300"
        }
        ${className}
      `}
      aria-label={`Sort by ${title} ${
        isActive && currentSortDirection === "asc" ? "descending" : "ascending"
      }`}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex flex-col items-center justify-center h-full py-1">
        <span className="flex items-center font-semibold whitespace-nowrap">
          {title}
          {isActive && (
            <span className="ml-0.5 inline-flex">
              {currentSortDirection === "asc" ? (
                <ChevronUp size={14} className="text-primary-500" />
              ) : (
                <ChevronDown size={14} className="text-primary-500" />
              )}
            </span>
          )}
        </span>

        {/* Active indicator line */}
        {isActive && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400"
            style={{
              animation: "fadeIn 0.2s ease-in-out",
            }}
          />
        )}
      </div>
    </th>
  );
};
