import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { MAX_TEAM_BUDGET } from "../../types/constants";

type Props = {
    filterAvailable?: boolean;
    toogle?: () => void;
    remainingBudget?: number;
    totalBudget?: number;
    selectedPlayersCount?: number;
    requiredPlayersCount?: number;
};

/** Renders Budget indicator component */
export function BudgetIndicator({ remainingBudget = 0 }: Props) {
    const [lastBudget, setLastBudget] = useState(remainingBudget);

    const amountUsed = MAX_TEAM_BUDGET - remainingBudget;
    const isDangerouslyLow = amountUsed > 200;
    const hasChanged = remainingBudget !== lastBudget;


    // Update lastBudget when budget changes
    useEffect(() => {
        setLastBudget(remainingBudget);
    }, [remainingBudget]);

    return (
        <motion.div
            className={`flex items-center gap-1 px-3 py-1 rounded-full shadow-sm ${isDangerouslyLow
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
                {amountUsed} / {MAX_TEAM_BUDGET}
            </span>
        </motion.div>
    );
}