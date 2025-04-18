import React from "react";
import { Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface StickyHeaderProps {
  selectedCount: number;
  totalCount: number;
  budget: number;
  isNegativeBudget: boolean;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  selectedCount,
  totalCount,
  budget,
  isNegativeBudget,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-[61px] left-0 right-0 bg-white/90 dark:bg-dark-850/90 z-40 shadow-md"
    >
      <div className="container mx-auto max-w-[1024px] flex justify-between items-center py-4 px-4">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <Users size={18} className="text-primary-600 dark:text-primary-400" />
          <span className="text-gray-800 dark:text-white font-medium">
            {selectedCount}/{totalCount} players
          </span>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isNegativeBudget
              ? "bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-300"
              : "bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-300"
          }`}
        >
          <Wallet size={18} />
          <span className="font-medium">{budget.toLocaleString()} pts</span>
        </div>
      </div>
    </motion.div>
  );
};
