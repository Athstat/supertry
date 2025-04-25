import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface PlayerCountIndicatorProps {
  selectedCount: number;
  maxPlayers?: number;
  animate?: boolean;
}

export const PlayerCountIndicator: React.FC<PlayerCountIndicatorProps> = ({
  selectedCount,
  maxPlayers = 5,
  animate = false,
}) => {
  // Determine color based on count
  const getCountColor = () => {
    if (selectedCount === maxPlayers)
      return "text-green-500 dark:text-green-400";
    if (selectedCount >= maxPlayers * 0.7)
      return "text-amber-500 dark:text-amber-400";
    return "text-blue-500 dark:text-blue-400";
  };

  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 rounded-lg text-sm shadow-sm"
      animate={
        animate
          ? {
              scale: [1, 1.05, 1],
              transition: { duration: 0.3 },
            }
          : {}
      }
    >
      <User size={14} className="text-gray-500 dark:text-gray-400" />
      <span className="text-gray-500 dark:text-gray-400 font-medium">
        Players:
      </span>
      <span className={`font-semibold ${getCountColor()}`}>
        {selectedCount} / {maxPlayers}
      </span>
    </motion.div>
  );
};
