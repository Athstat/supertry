import { CircleDollarSign } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

interface TableHeaderProps {
  sortBy: "price" | "rating" | "attack" | "defense" | "kicking";
  sortOrder: "asc" | "desc";
  onSort: (
    field: "price" | "rating" | "attack" | "defense" | "kicking"
  ) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  sortBy,
  sortOrder,
  onSort,
}) => {
  // Helper to render sort indicator
  const renderSortIndicator = (
    field: "price" | "rating" | "attack" | "defense" | "kicking",
    className?: string
  ) => {
    if (sortBy !== field) return null;

    return sortOrder === "desc" ? (
      <span className={twMerge("inline ml-1", className)}>▼</span>
    ) : (
      <span className={twMerge("inline ml-1", className)}>▲</span>
    );
  };

  return (
    <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-dark-700 border-y dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
      <div className="hidden sm:block w-12 mr-4"></div>{" "}
      {/* Image space - hidden on mobile */}
      <div className="flex-1 pr-4">Player / Team</div>
      {/* <div className="w-12 text-center flex items-center justify-center transition">FRM</div> */}
      
      <button
        onClick={() => onSort("price")}
        className={`text-left flex items-center justify-start w-10 transition ${
          sortBy === "price" ? "text-green-600" : ""
        }`}
      >
        <CircleDollarSign className="w-5 h-fit" />
        {renderSortIndicator("price", "ml-0")}
      </button>
      <button
        onClick={() => onSort("rating")}
        className={`w-16 text-left flex items-center justify-start transition ${
          sortBy === "rating" ? "text-green-600" : ""
        }`}
      >
        PR {renderSortIndicator("rating")}
      </button>
      <button
        onClick={() => onSort("attack")}
        className={`w-14 text-left flex items-center justify-start transition ${
          sortBy === "attack" ? "text-green-600" : ""
        }`}
      >
        ATK {renderSortIndicator("attack")}
      </button>
      <button
        onClick={() => onSort("defense")}
        className={`w-14 text-left flex items-center justify-start transition ${
          sortBy === "defense" ? "text-green-600" : ""
        }`}
      >
        DEF {renderSortIndicator("defense")}
      </button>
      <button
        onClick={() => onSort("kicking")}
        className={`w-14 text-left flex items-center justify-start transition ${
          sortBy === "kicking" ? "text-green-600" : ""
        }`}
      >
        KCK {renderSortIndicator("kicking")}
      </button>
    </div>
  );
};

export default TableHeader;
