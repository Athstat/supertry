import React from 'react';

interface TeamActionsProps {
  isTeamComplete: boolean;
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

const TeamActions: React.FC<TeamActionsProps> = ({
  isTeamComplete,
  isLoading,
  onReset,
  onSave,
}) => {
  return (
    <div className="flex justify-between mt-10 mb-8">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
      >
        Reset Selection
      </button>

      <button
        onClick={onSave}
        disabled={!isTeamComplete || isLoading}
        className={`
          px-6 py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-green-500
          ${
            isTeamComplete && !isLoading
              ? 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            Saving...
          </span>
        ) : (
          'Save Team'
        )}
      </button>
    </div>
  );
};

export default TeamActions;
