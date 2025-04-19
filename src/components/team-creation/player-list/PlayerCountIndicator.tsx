import React from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerCountIndicatorProps {
  selectedCount: number;
  maxPlayers?: number;
  animate?: boolean;
}

export const PlayerCountIndicator: React.FC<PlayerCountIndicatorProps> = ({
  selectedCount,
  maxPlayers = 15,
  animate = false,
}) => {
  return (
    <motion.div
      className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100/80 dark:bg-slate-800/30 text-gray-700 dark:text-gray-200 backdrop-blur-md shadow-sm"
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
