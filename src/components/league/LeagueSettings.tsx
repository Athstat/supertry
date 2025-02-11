import React from "react";
import { Users, Info, ChevronRight } from "lucide-react";

interface LeagueSettingsProps {
  onClose: () => void;
}

export function LeagueSettings({ onClose }: LeagueSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">
          League Settings
        </h2>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/40 transition-colors">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-primary-500" />
              <span className="font-medium dark:text-gray-100">
                Invite Players
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/40 transition-colors">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-primary-500" />
              <span className="font-medium dark:text-gray-100">
                League Rules
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/40 transition-colors text-red-600 dark:text-red-500">
            <span className="font-medium">Leave League</span>
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-100 dark:bg-dark-800/40 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
