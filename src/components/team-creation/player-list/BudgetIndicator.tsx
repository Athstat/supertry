import React from "react";
import { motion } from "framer-motion";

interface BudgetIndicatorProps {
  budget: number;
  maxBudget?: number;
}

export const BudgetIndicator: React.FC<BudgetIndicatorProps> = ({
  budget,
  maxBudget = 200,
}) => {
  // Calculate the percentage of budget used
  const budgetPercentage = ((maxBudget - budget) / maxBudget) * 100;

  // Determine color based on budget remaining
  const getBudgetColor = () => {
    if (budgetPercentage >= 90) return "text-red-500 dark:text-red-400";
    if (budgetPercentage >= 75) return "text-amber-500 dark:text-amber-400";
    return "text-green-500 dark:text-green-400";
  };

  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 rounded-lg text-sm shadow-sm"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-gray-500 dark:text-gray-400 font-medium">
        Budget:
      </span>
      <span className={`font-semibold ${getBudgetColor()}`}>
        {budget} / {maxBudget}
      </span>
    </motion.div>
  );
};
