import React from 'react';

interface TeamNameInputProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}

export const TeamNameInput: React.FC<TeamNameInputProps> = ({ 
  teamName, 
  onTeamNameChange 
}) => {
  return (
    <div className="mt-8 mb-6">
      <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Team Name
      </label>
      <input
        type="text"
        id="team-name"
        value={teamName}
        onChange={(e) => onTeamNameChange(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-dark-700 dark:text-gray-100"
        placeholder="Enter your team name"
        maxLength={25}
      />
    </div>
  );
};

export default TeamNameInput;
