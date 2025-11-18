import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { BudgetIndicator } from "./BudgetIndicator";

// DEPRECATED
type Props = {
    filterAvailable?: boolean;
    toogle?: () => void;
    remainingBudget?: number;
    totalBudget?: number;
    selectedPlayersCount?: number;
    requiredPlayersCount?: number;
};

// Player Count Indicator Component
const PlayerCountIndicator: React.FC<{
  selectedCount: number;
  maxPlayers?: number;
  animate?: boolean;
}> = ({ selectedCount, maxPlayers = 6, animate = false }) => {
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
  selectedPlayersCount = 0,
  requiredPlayersCount = 6,
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
          <p className="text-xs" >
            Confirmed Players Only
          </p>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <PlayerCountIndicator
          selectedCount={selectedPlayersCount}
          maxPlayers={requiredPlayersCount}
        />
        <BudgetIndicator remainingBudget={remainingBudget} />
      </div>
    </div>
  );
}
