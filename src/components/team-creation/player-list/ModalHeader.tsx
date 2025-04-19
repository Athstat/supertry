import React from "react";
import { X, Search } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { BudgetIndicator } from "./BudgetIndicator";
import { PlayerCountIndicator } from "./PlayerCountIndicator";

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
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  showSearchAndFilters,
  handleToggleSearch,
  selectedPlayerCount,
  maxPlayers = 15,
  remainingBudget,
  maxBudget = 200,
  shouldAnimatePlayerCount,
  headerRef,
  scrollY,
}) => {
  // Generate the transform value from scrollY
  const headerShadow = useTransform(
    scrollY,
    [0, 20],
    ["var(--header-shadow-default)", "var(--header-shadow-scrolled)"]
  );

  return (
    <div className="sticky top-0 inset-x-0 z-30">
      <motion.div
        ref={headerRef}
        className="w-full border-b border-gray-200/40 dark:border-gray-800/40 relative"
        style={{
          background: "var(--header-gradient)",
          backdropFilter: "blur(12px)",
          boxShadow: headerShadow,
        }}
      >
        <div className="relative flex flex-wrap md:flex-nowrap justify-between items-center p-4 pr-12">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mr-2 transition-colors duration-300">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-gray-200/70 hover:bg-gray-300/70 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white p-1.5 rounded-lg transition-colors"
            aria-label="Close"
            tabIndex={0}
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mt-1 md:mt-0">
            <motion.button
              onClick={handleToggleSearch}
              className={`bg-gray-200/70 hover:bg-gray-300/70 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white p-1.5 rounded-lg transition-colors ${
                showSearchAndFilters
                  ? "bg-gray-300/90 dark:bg-white/20 ring-2 ring-primary-300 dark:ring-primary-700"
                  : ""
              }`}
              aria-label={showSearchAndFilters ? "Hide search" : "Show search"}
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};
