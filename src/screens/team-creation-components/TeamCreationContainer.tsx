import React from 'react';
import { TeamCreationHeader } from '../../components/team-creation/TeamCreationHeader';

interface TeamCreationContainerProps {
  league?: any;
  currentBudget: number;
  totalBudget: number;
  selectedPlayersCount: number;
  requiredPlayersCount: number;
  children: React.ReactNode;
}

export const TeamCreationContainer: React.FC<TeamCreationContainerProps> = ({
  league,
  currentBudget,
  totalBudget,
  selectedPlayersCount,
  requiredPlayersCount,
  children
}) => {
  return (
    <div className="container mx-auto px-4 max-w-[1024px] pb-4 bg-gray-50 dark:bg-dark-850 min-h-screen">
      {/* Header with league information */}
      <TeamCreationHeader 
        title={league?.title || "Create Your Team"}
        currentBudget={currentBudget}
        totalBudget={totalBudget}
        selectedPlayersCount={selectedPlayersCount}
        totalPositions={requiredPlayersCount}
      />
      
      {/* Main content */}
      <div className="px-4">
        {children}
      </div>
    </div>
  );
};

export default TeamCreationContainer;
