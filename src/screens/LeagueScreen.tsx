import React, { useState, useEffect } from "react";
import { LeagueHeader } from "../components/league/LeagueHeader";
import { LeagueStandings } from "../components/league/LeagueStandings";
import { LeagueSettings } from "../components/league/LeagueSettings";
import { TabButton } from "../components/shared/TabButton";
import { RankedFantasyTeam } from "../types/league";
import { fantasyTeamService } from "../services/teamService";
import { TeamAthletesModal } from "../components/league/TeamAthletesModal";
import LeagueGroupChatFeed from "../components/leagues/LeagueGroupChat";
import { FantasyLeagueFixturesList } from "../components/league/FixturesList";
import { IFantasyLeague } from "../types/fantasyLeague";
import FantasyLeagueProvider from "../contexts/FantasyLeagueContext";
import { useFantasyLeague } from "../components/league/useFantasyLeague";
import { analytics } from "../services/anayticsService";
import { useNavigate } from "react-router-dom";
import { isLeagueLocked } from "../utils/leaguesUtils";
import { Lock } from "lucide-react";

type LeagueScreenTabs = "standings" | "chat" | "fixtures";

export function LeagueScreen() {

  const [showSettings, setShowSettings] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LeagueScreenTabs>("standings");
  const [selectedTeam, setSelectedTeam] = useState<RankedFantasyTeam | null>(null);
  const [teamAthletes, setTeamAthletes] = useState<any[]>([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);

  const { leagueInfo, userTeam, error, isLoading, league, teams } = useFantasyLeague();


  useEffect(() => {
    setShowJumpButton(Boolean(userTeam?.rank && userTeam.rank > 5));
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle team click
  const handleTeamClick = async (team: RankedFantasyTeam) => {
    setSelectedTeam(team);
    setLoadingAthletes(true);

    try {
      // Fetch team athletes
      const athletes = await fantasyTeamService.fetchTeamAthletes(team.id);
      setTeamAthletes(athletes);
    } catch (error) {
      console.error("Failed to fetch team athletes:", error);
      // You can set an error state here if needed
    } finally {
      setLoadingAthletes(false);
    }
  };

  // Close team athletes modal
  const handleCloseModal = () => {
    setSelectedTeam(null);
    setTeamAthletes([]);
  };

  const handleJoinLeague = () => {

    if (league) {
      analytics.trackTeamCreationStarted(
        league.id,
        league.official_league_id
      );

      navigate(`/${league.official_league_id}/create-team`, {
        state: { league },
      });

    }
  }

  // Function to view a team's details
  const viewTeam = (teamId: string) => {
    console.log("Viewing team:", teamId);
    // Navigate to team details page or open a modal
  };

  const isLocked = isLeagueLocked(league?.join_deadline);

  return (
    <FantasyLeagueProvider userTeam={userTeam} league={league} >
      <div className="min-h-screen bg-gray-50 dark:bg-dark-850">
        <LeagueHeader
          leagueInfo={leagueInfo}
          league={league}
          onOpenSettings={() => setShowSettings(true)}
          isLoading={isLoading}
        >
          {!isLoading && userTeam === undefined && !isLocked && (
            <button
              onClick={handleJoinLeague}
              className="hidden lg:flex bg-white text-blue-600 font-semibold rounded-full px-4 py-2 shadow-md hover:bg-gray-100 transition"
            >
              Join This League
            </button>
          )}

          {!isLoading && userTeam === undefined && isLocked && (
            <button
              disabled
              className="hidden cursor-not-allowed opacity-70 lg:flex bg-white text-blue-600 font-semibold rounded-full px-4 py-2 shadow-md hover:bg-gray-100 transition flex-row items-center justify-center gap-1"
            >
              Join This League
              <Lock className="w-3 h-3" />
            </button>
          )}
        </LeagueHeader>
        <div className="container mx-auto px-4 sm:px-6 py-6 pb-20 lg:pb-6 max-w-3xl">

          {/* {league && <Countdown league={league} />} */}

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto mb-6 bg-white dark:bg-dark-800 rounded-t-xl shadow-sm">
            <TabButton
              active={activeTab === "standings"}
              onClick={() => setActiveTab("standings")}
            >
              Standings
            </TabButton>
            <TabButton
              active={activeTab === "chat"}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </TabButton>
            <TabButton
              active={activeTab === "fixtures"}
              onClick={() => setActiveTab("fixtures")}
            >
              Fixtures
            </TabButton>
          </div>
          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "standings" && league && (
              <LeagueStandings
                teams={teams}
                showJumpButton={showJumpButton}
                onJumpToTeam={() => {
                  const userTeamRef = document.querySelector(
                    '[data-user-team="true"]'
                  );
                  if (userTeamRef) {
                    userTeamRef.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                isLoading={isLoading}
                error={error}
                onTeamClick={(team) => {
                  handleTeamClick(team);
                  viewTeam(team.id);
                }}
                league={league}
              />
            )}
            {activeTab === "chat" && (
              <>
                {league && <LeagueGroupChatFeed league={league} />}
              </>
            )}
            {activeTab === "fixtures" && (
              <FantasyLeagueFixturesList
                league={league as IFantasyLeague}
              />
            )}
          </div>
        </div>
        {showSettings && (
          <LeagueSettings onClose={() => setShowSettings(false)} />
        )}
        {/* Team Athletes Modal */}
        {selectedTeam && (
          <TeamAthletesModal
            team={selectedTeam as RankedFantasyTeam}
            athletes={teamAthletes}
            onClose={handleCloseModal}
            isLoading={loadingAthletes}
          />
        )}
        {/* Mobile CTA Button */}
        {!isLoading && userTeam === undefined && league && !isLocked && (
          <button
            onClick={handleJoinLeague}
            className="lg:hidden fixed bottom-20 inset-x-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 shadow-lg"
          >
            Join This League
          </button>
        )}

        {!isLoading && userTeam === undefined && isLocked && (
          <button
            disabled
            className="lg:hidden cursor-not-allowed flex flex-row items-center justify-center gap-2 fixed bottom-20 inset-x-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 shadow-lg"
          >
            Join This League
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>
    </FantasyLeagueProvider>
  );
}