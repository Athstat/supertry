import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerSearchBar } from "./PlayerSearchBar";
import { FilterSortControls } from "./FilterSortControls";
import { FilterPanel } from "./FilterPanel";
import { SortPanel } from "./SortPanel";
import { LoadingSpinner } from "./LoadingSpinner";

interface SearchFilterPanelProps {
  showSearchAndFilters: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showSort: boolean;
  setShowSort: (show: boolean) => void;
  positionFilter: string;
  teamFilter: string;
  clearFilters: () => void;
  loading: boolean;
  availablePositions: string[];
  handlePositionFilter: (position: string) => void;
  availableTeams: string[];
  handleTeamFilter: (team: string) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  showSearchAndFilters,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  showSort,
  setShowSort,
  positionFilter,
  teamFilter,
  clearFilters,
  loading,
  availablePositions,
  handlePositionFilter,
  availableTeams,
  handleTeamFilter,
  sortField,
  sortDirection,
  handleSort,
}) => {
  return (
    <AnimatePresence initial={false}>
      {showSearchAndFilters && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="absolute top-[var(--header-height)] left-0 right-0 z-40"
          style={{
            background: "var(--header-gradient)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 6px 12px -6px var(--gradient-shadow-color)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div className="px-4 py-3 relative">
            {loading ? (
              <div className="py-1">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                <PlayerSearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />

                {/* Filter controls */}
                <FilterSortControls
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  showSort={showSort}
                  setShowSort={setShowSort}
                  positionFilter={positionFilter}
                  teamFilter={teamFilter}
                  clearFilters={clearFilters}
                />
              </div>
            )}

            {/* Filter and sort panels overlays */}
            <AnimatePresence>
              {/* Backdrop for filter and sort panels */}
              {(showFilters || showSort) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 bg-black/10 dark:bg-black/20 z-40"
                  onClick={() => {
                    setShowFilters(false);
                    setShowSort(false);
                  }}
                />
              )}

              {/* Filter panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full mt-1 px-4 z-50"
                  style={{ transformOrigin: "top center" }}
                >
                  <div className="bg-white dark:bg-dark-800 shadow-xl dark:shadow-black/40 rounded-lg border border-gray-200/50 dark:border-gray-700/30 overflow-auto max-h-[60vh]">
                    <FilterPanel
                      setShowFilters={setShowFilters}
                      availablePositions={availablePositions}
                      positionFilter={positionFilter}
                      handlePositionFilter={handlePositionFilter}
                      availableTeams={availableTeams}
                      teamFilter={teamFilter}
                      handleTeamFilter={handleTeamFilter}
                    />
                  </div>
                </motion.div>
              )}

              {/* Sort panel */}
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full mt-1 px-4 z-50"
                  style={{ transformOrigin: "top center" }}
                >
                  <div className="bg-white dark:bg-dark-800 shadow-xl dark:shadow-black/40 rounded-lg border border-gray-200/50 dark:border-gray-700/30 overflow-auto max-h-[60vh]">
                    <SortPanel
                      setShowSort={setShowSort}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      handleSort={handleSort}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
