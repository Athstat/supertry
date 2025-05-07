import React from "react";

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
    field: "price" | "rating" | "attack" | "defense" | "kicking"
  ) => {
    if (sortBy !== field) return null;

    return sortOrder === "desc" ? (
      <span className="inline ml-1">▼</span>
    ) : (
      <span className="inline ml-1">▲</span>
    );
  };

  return (
    <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-dark-700 border-y dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
      <div className="hidden sm:block w-10 mr-3"></div>{" "}
      {/* Image space - hidden on mobile */}
      <div className="flex-1 pr-2">Player / Team</div>

      
      {/* <div className="w-12 text-center flex items-center justify-center transition">FRM</div> */}
      
      <div 
        className={`w-12 text-center flex items-center justify-center transition `}
      >
        <span className="font-semibold">FRM</span>
        
      </div>
      
      <button 
        onClick={() => onSort('price')}
        className={`w-12 text-center flex items-center justify-center transition ${sortBy === 'price' ? 'text-green-600' : ''}`}

      >
        <span className="font-semibold">COINS</span>
        {renderSortIndicator("price")}
      </button>
      <button
        onClick={() => onSort("rating")}
        className={`w-12 text-center flex items-center justify-center transition ${
          sortBy === "rating" ? "text-green-600" : ""
        }`}
      >
        PR {renderSortIndicator("rating")}
      </button>
      <button
        onClick={() => onSort("attack")}
        className={`w-16 text-center flex items-center justify-center transition ${
          sortBy === "attack" ? "text-green-600" : ""
        }`}
      >
        ATK {renderSortIndicator("attack")}
      </button>
      <button
        onClick={() => onSort("defense")}
        className={`w-16 text-center flex items-center justify-center transition ${
          sortBy === "defense" ? "text-green-600" : ""
        }`}
      >
        DEF {renderSortIndicator("defense")}
      </button>
      <button
        onClick={() => onSort("kicking")}
        className={`w-16 text-center flex items-center justify-center transition ${
          sortBy === "kicking" ? "text-green-600" : ""
        }`}
      >
        KCK {renderSortIndicator("kicking")}
      </button>
    </div>
  );
};

export default TableHeader;
