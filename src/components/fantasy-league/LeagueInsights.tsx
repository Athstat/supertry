import React from "react";
import { Star } from "lucide-react";

export function LeagueInsights() {
  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm mt-6 ">
      <div className="p-4 border-b border-gray-700 dark:border-dark-600">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Star size={24} className="text-primary-500" />
          League Insights
        </h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Highest Score
          </div>
          <div className="font-medium dark:text-gray-200">92 pts</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Average Score
          </div>
          <div className="font-medium dark:text-gray-200">64 pts</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Most Selected Player
          </div>
          <div className="font-medium dark:text-gray-200">James Wilson</div>
        </div>
      </div>
    </div>
  );
}
