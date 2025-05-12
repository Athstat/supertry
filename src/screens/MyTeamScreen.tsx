import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Team } from "../types/team";
import { TeamStats } from "../components/team/TeamStats";
import { TeamHeader } from "../components/my-team/TeamHeader";
import { TeamTabsContent } from "../components/my-team/TeamTabsContent";
import {
  TeamLoading,
  TeamError,
} from "../components/my-team/TeamLoadingAndError";
import {
  TeamDataProvider,
  useTeamData,
} from "../components/my-team/TeamDataProvider";
import { TeamActions, useTeamActions } from "../components/my-team/TeamActions";
import FantasyLeagueProvider from "../contexts/FantasyLeagueContext";

type TabType = "edit-team" | "view-pitch";

// TeamContent component - needs to be inside the TeamActions context
const TeamContent: React.FC<{
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}> = ({ activeTab, setActiveTab }) => {
  
  const { positionList, players, formation } = useTeamData();

  const {
    handlePlayerClick,
    handlePositionSelect,
    handleViewStats,
    handleSwapPlayer,
  } = useTeamActions();

  return (
    <TeamTabsContent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      positionList={positionList}
      players={players}
      formation={formation}
      handlePositionSelect={handlePositionSelect}
      handlePlayerClick={handlePlayerClick}
      fetchingMarketPlayers={false} // Always pass false to prevent loading state on buttons
      handleViewStats={handleViewStats}
      handleSwapPlayer={handleSwapPlayer}
    />
  );
};

// Main content that uses both TeamData and TeamActions contexts
const MyTeamContent: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("view-pitch");
  const [initialized, setInitialized] = useState(false);

  const {
    team,
    athletes,
    isLoading,
    error,
    leagueInfo,
    fetchingLeague,
    totalPoints,
    matchesPlayed,
    players,
    formation,
  } = useTeamData();

  // Set initialized to true after first render when we know loading state
  React.useEffect(() => {
    setInitialized(true);
  }, []);

  // Don't render anything on initial load to prevent flicker
  if (!initialized) {
    return null;
  }

  if (isLoading) {
    return <TeamLoading isFullScreen={false} />;
  }

  if (error || !team) {
    return <TeamError error={error || "Team not found"} />;
  }

  return (
    <FantasyLeagueProvider league={leagueInfo ?? undefined} >
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Team Header */}
          <TeamHeader
            team={team}
            athletesCount={athletes.length}
            totalPoints={totalPoints}
            leagueInfo={leagueInfo}
            fetchingLeague={fetchingLeague}
          />
          {/* Team Stats */}
          <TeamStats
            team={
              {
                ...team,
                totalPoints,
                players,
                formation,
                matchesPlayed,
                rank: (team as any).rank || 0,
              } as Team
            }
          />
          {/* Team Actions with Tabs Content as children */}
          {teamId && (
            <TeamActions teamId={teamId}>
              <TeamContent 
                activeTab={activeTab}
                setActiveTab={setActiveTab} 
              />
            </TeamActions>
          )}
        </div>
      </main>
    </FantasyLeagueProvider>
  );
};

export function MyTeamScreen() {
  return (
    <TeamDataProvider>
      <MyTeamContent />
    </TeamDataProvider>
  );
}
