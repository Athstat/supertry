import React from "react";
import { X } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onReset}
        className="w-full bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
        aria-label="Reset selection"
        tabIndex={0}
      >
        <X size={20} />
        Reset Selection
      </button>
    </div>
  );
};
