import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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
import { RankedFantasyTeam } from "../types/league";
import { IFantasyLeague } from "../types/fantasyLeague";

type TabType = "edit-team" | "view-pitch";

// TeamContent component - needs to be inside the TeamActions context
const TeamContent: React.FC<{
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  league?: IFantasyLeague
}> = ({ activeTab, setActiveTab, league }) => {
  
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
      league={league}
    />
  );
};

// Main content that uses both TeamData and TeamActions contexts
const MyTeamContent: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("view-pitch");
  const [initialized, setInitialized] = useState(false);
  const {state} = useLocation();
  const teamWithRank = state?.teamWithRank ? state?.teamWithRank as RankedFantasyTeam : undefined;

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
            rank={teamWithRank?.rank}
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
                ...(teamWithRank ? {rank: teamWithRank?.rank} : {}),
              } as Team
            }
          />
          {/* Team Actions with Tabs Content as children */}
          {teamId && (
            <TeamActions league={leagueInfo ?? undefined} teamId={teamId}>
              <TeamContent 
                activeTab={activeTab}
                setActiveTab={setActiveTab} 
                league={leagueInfo ?? undefined}
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
