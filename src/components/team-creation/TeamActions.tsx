import React from 'react';

interface TeamActionsProps {
  isTeamComplete: boolean;
  onReset: () => void;
  onSave: () => void;
}

const TeamActions: React.FC<TeamActionsProps> = ({ isTeamComplete, onReset, onSave }) => {
  return (
    <div className="flex justify-between mt-10 mb-8 px-4">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
      >
        Reset Selection
      </button>
      
      <button
        onClick={onSave}
        disabled={!isTeamComplete}
      className={`
        px-6 py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-green-500
        ${isTeamComplete 
          ? 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600' 
          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
      `}
      >
        Save Team
      </button>
    </div>
  );
};

export default TeamActions;
