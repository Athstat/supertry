import React, { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { motion } from "framer-motion";

interface BudgetIndicatorProps {
  budget?: number;
  maxBudget?: number;
}

export const BudgetIndicator: React.FC<BudgetIndicatorProps> = ({
  budget = 0,
  maxBudget = 200,
}) => {
  const [lastBudget, setLastBudget] = useState(budget);
  const isDangerouslyLow = budget < 50;
  const hasChanged = budget !== lastBudget;

  // Update lastBudget when budget changes
  useEffect(() => {
    setLastBudget(budget);
  }, [budget]);

  return (
    <motion.div
      className={`flex items-center gap-1 px-3 py-2 rounded-full shadow-sm ${
        isDangerouslyLow
          ? "bg-red-50/90 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-red-500/20"
          : "bg-gray-100/80 dark:bg-slate-700/30 text-gray-700 dark:text-gray-200 backdrop-blur-md"
      }`}
      animate={{
        boxShadow: isDangerouslyLow
          ? [
              "0 0 0 rgba(239, 68, 68, 0.2)",
              "0 0 12px rgba(239, 68, 68, 0.4)",
              "0 0 5px rgba(239, 68, 68, 0.2)",
            ]
          : "0 1px 3px rgba(0, 0, 0, 0.1)",
        scale: hasChanged ? [1, 1.05, 1] : 1,
      }}
      transition={{
        boxShadow: {
          repeat: isDangerouslyLow ? Infinity : 0,
          duration: 1.5,
          repeatType: "reverse",
        },
        scale: {
          duration: 0.3,
        },
      }}
    >
      <Coins size={14} className="text-yellow-500 dark:text-yellow-400" />
      <span className="text-xs font-medium whitespace-nowrap">
        {budget} / {maxBudget}
      </span>
    </motion.div>
  );
};
