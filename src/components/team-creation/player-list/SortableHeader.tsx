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
        font-medium text-xs text-center p-2 cursor-pointer
        transition-colors bg-white dark:bg-dark-850
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
      <div className="flex items-center justify-center gap-0.5">
        <span>{title}</span>
        {isActive &&
          (currentSortDirection === "asc" ? (
            <ChevronUp size={14} className="flex-shrink-0" />
          ) : (
            <ChevronDown size={14} className="flex-shrink-0" />
          ))}
      </div>
    </th>
  );
};
