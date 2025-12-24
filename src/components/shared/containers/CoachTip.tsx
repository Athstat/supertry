import React from "react";
import { Lightbulb, X } from "lucide-react";
import { motion } from "framer-motion";

interface CoachTipProps {
  message: string;
  onDismiss: () => void;
}

/** Renders Coach Tip Component */
export const CoachTip: React.FC<CoachTipProps> = ({ message, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3"
    >
      <Lightbulb
        size={20}
        className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
      />
      <div className="flex-1">
        <p className="text-blue-800 dark:text-blue-300 text-sm">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        aria-label="Dismiss tip"
        tabIndex={0}
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};
