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
    fetchingMarketPlayers,
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
      fetchingMarketPlayers={fetchingMarketPlayers}
      handleViewStats={handleViewStats}
      handleSwapPlayer={handleSwapPlayer}
    />
  );
};

// Main content that uses both TeamData and TeamActions contexts
const MyTeamContent: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("edit-team");

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

  if (isLoading) {
    return <TeamLoading />;
  }

  if (error || !team) {
    return <TeamError error={error || "Team not found"} />;
  }

  return (
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
            <TeamContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </TeamActions>
        )}
      </div>
    </main>
  );
};

export function MyTeamScreen() {
  return (
    <TeamDataProvider>
      <MyTeamContent />
    </TeamDataProvider>
  );
}
