import React from "react";
import { TeamCreationHeader } from "../../components/team-creation/TeamCreationHeader";

interface TeamCreationContainerProps {
  league?: any;
  currentBudget: number;
  totalBudget: number;
  selectedPlayersCount: number;
  requiredPlayersCount: number;
  isFromWelcome?: boolean;
  children: React.ReactNode;
  isLocked?: boolean
}

export const TeamCreationContainer: React.FC<TeamCreationContainerProps> = ({
  league,
  currentBudget,
  totalBudget,
  selectedPlayersCount,
  requiredPlayersCount,
  isFromWelcome,
  children,
  isLocked
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
        isFromWelcome={isFromWelcome}
        isLocked={isLocked}
      />

      {isLocked && 
        <div className="w-full items-center justify-center p-10 flex" >
          <p>You can't create a team for {league?.title}, it is now locked</p>
        </div>
      }

      {/* Main content */}
      { !isLocked && <div className="px-4">{children}</div>}
    </div>
  );
};

export default TeamCreationContainer;
