import { motion } from "framer-motion";
import { Users, Coins } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  filterAvailable: boolean;
  toogle: () => void;
  remainingBudget?: number;
  totalBudget?: number;
  selectedPlayersCount?: number;
  requiredPlayersCount?: number;
};

// Budget Indicator Component
const BudgetIndicator: React.FC<{ budget: number; maxBudget?: number }> = ({
  budget,
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
      className={`flex items-center gap-1 px-3 py-1 rounded-full shadow-sm ${
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

// Player Count Indicator Component
const PlayerCountIndicator: React.FC<{
  selectedCount: number;
  maxPlayers?: number;
  animate?: boolean;
}> = ({ selectedCount, maxPlayers = 15, animate = false }) => {
  return (
    <motion.div
      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100/80 dark:bg-slate-800/30 text-gray-700 dark:text-gray-200 backdrop-blur-md shadow-sm"
      initial={animate ? { scale: 1 } : false}
      animate={
        animate
          ? {
              scale: [1, 1.1, 1],
            }
          : {}
      }
      transition={{ duration: 0.6 }}
    >
      <Users size={14} className="text-indigo-500 dark:text-indigo-400" />
      <span className="text-xs font-medium whitespace-nowrap">
        {selectedCount} / {maxPlayers}
      </span>
    </motion.div>
  );
};

export default function AvailableFilter({
  filterAvailable,
  toogle,
  remainingBudget = 0,
  totalBudget = 200,
  selectedPlayersCount = 0,
  requiredPlayersCount = 15,
}: Props) {
  return (
    <div className="dark:text-slate-300 py-2 px-6 w-full items-center justify-between flex flex-row">
      <div className="flex items-center gap-2">
        <input
          onChange={() => {}}
          id="checkbox_input"
          className="h-5 w-5"
          checked={filterAvailable}
          onClick={toogle}
          type="checkbox"
        />
        <label htmlFor="checkbox_input" className="p-0 m-0 h-fit">
          Show Confirmed Players Only
        </label>
      </div>

      <div className="flex items-center gap-2">
        <PlayerCountIndicator
          selectedCount={selectedPlayersCount}
          maxPlayers={requiredPlayersCount}
        />
        <BudgetIndicator budget={remainingBudget} maxBudget={totalBudget} />
      </div>
    </div>
  );
}
