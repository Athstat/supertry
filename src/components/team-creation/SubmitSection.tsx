import React from "react";
import { AlertCircle, ChevronRight } from "lucide-react";

interface SubmitSectionProps {
  selectedPlayersCount: number;
  totalPositions: number;
  teamName: string;
  currentBudget: number;
  onReview: () => void;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  selectedPlayersCount,
  totalPositions,
  teamName,
  currentBudget,
  onReview,
}) => {
  const remainingPlayers = totalPositions - selectedPlayersCount;
  const isComplete = selectedPlayersCount === totalPositions;
  const isValid = isComplete && teamName.trim() !== "" && currentBudget >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
        <AlertCircle size={20} />
        <span className="text-sm">
          {!isComplete
            ? `Select ${remainingPlayers} more player${
                remainingPlayers !== 1 ? "s" : ""
              } to complete your team`
            : "Your team is ready for review!"}
        </span>
      </div>
      <button
        onClick={onReview}
        disabled={!isValid}
        className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        tabIndex={isValid ? 0 : -1}
        aria-label="Review and submit team"
      >
        Review & Submit Team
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
