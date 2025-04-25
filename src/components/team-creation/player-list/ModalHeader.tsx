import React from "react";
import { X, Search, Filter, ArrowUpDown } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { BudgetIndicator } from "./BudgetIndicator";
import { PlayerCountIndicator } from "./PlayerCountIndicator";
import { ViewToggle, ViewMode } from "./ViewToggle";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  showSearchAndFilters: boolean;
  handleToggleSearch: () => void;
  selectedPlayerCount: number;
  maxPlayers?: number;
  remainingBudget: number;
  maxBudget?: number;
  shouldAnimatePlayerCount: boolean;
  headerRef: React.RefObject<HTMLDivElement>;
  scrollY: any; // Motion value from framer-motion
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  // New props for filter and sort
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  showSort?: boolean;
  setShowSort?: (show: boolean) => void;
  positionFilter?: string;
  teamFilter?: string;
  clearFilters?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  showSearchAndFilters,
  handleToggleSearch,
  selectedPlayerCount,
  maxPlayers = 5,
  remainingBudget,
  maxBudget = 200,
  shouldAnimatePlayerCount,
  headerRef,
  scrollY,
  viewMode,
  setViewMode,
  // Filter and sort props
  showFilters = false,
  setShowFilters = () => {},
  showSort = false,
  setShowSort = () => {},
  positionFilter,
  teamFilter,
  clearFilters,
}) => {
  // Generate the transform value from scrollY
  const headerShadow = useTransform(
    scrollY,
    [0, 20],
    ["var(--header-shadow-default)", "var(--header-shadow-scrolled)"]
  );

  // Check if any filters are active
  const filtersActive = positionFilter || teamFilter;

  // Handle filter toggle with explicit state management
  const handleFilterToggle = () => {
    // Close sort dropdown if filter is being opened
    if (!showFilters && showSort) {
      setShowSort(false);
    }
    setShowFilters(!showFilters);
  };

  // Handle sort toggle with explicit state management
  const handleSortToggle = () => {
    // Close filter dropdown if sort is being opened
    if (!showSort && showFilters) {
      setShowFilters(false);
    }
    setShowSort(!showSort);
  };

  return (
    <div className="sticky top-0 inset-x-0 z-30">
      <motion.div
        ref={headerRef}
        className="w-full border-b border-gray-200/40 dark:border-gray-800/40 relative"
        style={{
          background: "var(--header-gradient)",
          backdropFilter: "blur(12px)",
          boxShadow: headerShadow,
          isolation: "isolate", // Force stacking context
          willChange: "transform", // Hint for GPU acceleration
        }}
      >
        {/* Content wrapper with blur prevention */}
        <div
          className="relative z-10"
          style={{
            backdropFilter: "none",
            WebkitBackdropFilter: "none", // Safari support
            isolation: "isolate",
          }}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 md:mb-0 transition-colors duration-300">
              {title}
            </h2>

            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 mt-2">
              <motion.button
                onClick={handleToggleSearch}
                className={`flex-shrink-0 bg-gray-200/70 hover:bg-gray-300/70 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white p-1.5 rounded-lg transition-colors ${
                  showSearchAndFilters
                    ? "bg-gray-300/90 dark:bg-white/20 ring-2 ring-primary-300 dark:ring-primary-700"
                    : ""
                }`}
                aria-label={
                  showSearchAndFilters ? "Hide search" : "Show search"
                }
                aria-expanded={showSearchAndFilters}
                tabIndex={0}
                whileTap={{ scale: 0.95 }}
                animate={
                  showSearchAndFilters
                    ? {
                        rotate: [0, -10, 0],
                        boxShadow: [
                          "0 0 0 rgba(37, 99, 235, 0)",
                          "0 0 0 2px rgba(37, 99, 235, 0.3)",
                          "0 0 0 rgba(37, 99, 235, 0)",
                        ],
                        transition: { duration: 0.3, times: [0, 0.5, 1] },
                      }
                    : {}
                }
              >
                <Search size={18} />
              </motion.button>

              <PlayerCountIndicator
                selectedCount={selectedPlayerCount}
                maxPlayers={maxPlayers}
                animate={shouldAnimatePlayerCount}
              />

              <BudgetIndicator budget={remainingBudget} maxBudget={maxBudget} />

              <div className="flex-grow"></div>

              {/* Desktop Filter and Sort Buttons (md and up) */}
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  onClick={handleFilterToggle}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors 
                    ${
                      showFilters
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        : "bg-white/10 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/60"
                    }`}
                  aria-label="Filter players"
                  aria-expanded={showFilters}
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter
                    size={14}
                    className={showFilters ? "text-primary-500" : ""}
                  />
                  <span>Filter</span>
                  {filtersActive && !showFilters && (
                    <span className="flex items-center justify-center w-4 h-4 ml-1 text-xs rounded-full bg-primary-500 text-white">
                      {(positionFilter ? 1 : 0) + (teamFilter ? 1 : 0)}
                    </span>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleSortToggle}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors
                    ${
                      showSort
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        : "bg-white/10 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/60"
                    }`}
                  aria-label="Sort players"
                  aria-expanded={showSort}
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUpDown
                    size={14}
                    className={showSort ? "text-primary-500" : ""}
                  />
                  <span>Sort</span>
                </motion.button>
              </div>

              {/* Desktop only view toggle */}
              <div className="hidden md:block">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile Filter, Sort, and View Toggle in single row */}
            <div className="md:hidden w-full flex items-center justify-between mt-2">
              <div className="flex items-center">
                <motion.button
                  onClick={handleFilterToggle}
                  className={`flex items-center justify-center h-10 gap-1 py-2 text-xs sm:text-sm rounded-lg transition-colors
                    ${
                      showFilters
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-300 dark:ring-primary-700"
                        : "bg-white/10 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/60"
                    } ${filtersActive && !showFilters ? "pr-1" : "px-2.5"}`}
                  aria-label="Filter players"
                  aria-expanded={showFilters}
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter
                    size={16}
                    className={showFilters ? "text-primary-500" : ""}
                  />
                  <span>Filter</span>
                  {filtersActive && !showFilters && (
                    <span className="flex items-center justify-center w-4 h-4 ml-1 text-xs rounded-full bg-primary-500 text-white">
                      {(positionFilter ? 1 : 0) + (teamFilter ? 1 : 0)}
                    </span>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleSortToggle}
                  className={`flex items-center justify-center h-10 gap-1 ml-2 py-2 text-xs sm:text-sm rounded-lg transition-colors
                    ${
                      showSort
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-300 dark:ring-primary-700"
                        : "bg-white/10 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-slate-700/60"
                    } px-2.5`}
                  aria-label="Sort players"
                  aria-expanded={showSort}
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUpDown
                    size={16}
                    className={showSort ? "text-primary-500" : ""}
                  />
                  <span>Sort</span>
                </motion.button>
              </div>

              {/* Mobile view toggle - added ml-auto */}
              <div className="">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter clear button - only shows when filters are active */}
            {filtersActive && clearFilters && (
              <div className="md:hidden w-full mt-2">
                <motion.button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                  aria-label="Clear filters"
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={14} />
                  <span>Clear filters</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Dropdown containers for Filters and Sort - positioned below header */}
      {(showFilters || showSort) && (
        <div className="absolute w-full z-20 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg border-t border-gray-200 dark:border-gray-800">
          {showFilters && (
            <div className="p-3">
              {/* Filter content would be rendered here */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                Filter by position, team, and more
              </div>
            </div>
          )}

          {showSort && (
            <div className="p-3">
              {/* Sort content would be rendered here */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                Sort by rating, price, or name
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
