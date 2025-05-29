import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Team } from "../types/team";
import { TeamStats } from "../components/team/TeamStats";
import { TeamHeader } from "../components/my-team/TeamHeader";
import { TeamLoading, TeamError } from "../components/my-team/TeamLoadingAndError";
import { TeamDataProvider, useTeamData } from "../components/my-team/TeamDataProvider";
import { TeamActions } from "../components/my-team/TeamActions";
import FantasyLeagueProvider from "../contexts/FantasyLeagueContext";
import { RankedFantasyTeam } from "../types/league";
import AthletesAvailabilityWarning from "../components/team/AthletesAvailabilityWarning";
import { MyTeamScreenTabType, MyTeamScreenTabView } from "../components/my-team/MyTeamScreenTabView";

export function MyTeamScreen() {
  return (
    <TeamDataProvider>
      <MyTeamScreenContent />
    </TeamDataProvider>
  );
}


/** Actual consumer content on my screen that consumes data from team data provider */
function MyTeamScreenContent() {

  const { teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState<MyTeamScreenTabType>("view-pitch");
  const [initialized, setInitialized] = useState(false);
  const { state } = useLocation();

  const teamWithRank = state?.teamWithRank
    ? (state?.teamWithRank as RankedFantasyTeam)
    : undefined;

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
  if (!initialized || isLoading) {
    return <TeamLoading isFullScreen={false} />;
  }

  if (error || !team) {
    return <TeamError error={error || "Team not found"} />;
  }

  return (
    <FantasyLeagueProvider league={leagueInfo ?? undefined}>
      <main className="container mx-auto px-4 py-6">

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
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
                ...(teamWithRank ? { rank: teamWithRank?.rank } : {}),
              } as Team
            }
          />

          {leagueInfo &&
            <AthletesAvailabilityWarning
              team={team}
              league={leagueInfo}
              athletes={athletes}
            />
          }

          {/* Team Actions with Tabs Content as children */}
          {teamId && (
            <TeamActions league={leagueInfo ?? undefined} teamId={teamId}>

              <MyTeamScreenTabView
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