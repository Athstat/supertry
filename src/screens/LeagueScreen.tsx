import React, { useState, useEffect } from "react";
import { LeagueHeader } from "../components/league/LeagueHeader";
import { LeagueStandings } from "../components/league/LeagueStandings";
import { LeagueSettings } from "../components/league/LeagueSettings";
import { TabButton } from "../components/shared/TabButton";
import {
  TeamStats,
  Fixture,
  LeagueInfo,
  LeagueFromState,
} from "../types/league";
import { ChatMessage, ChatUser } from "../types/chat";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { leagueService } from "../services/leagueService";
import { teamService } from "../services/teamService";
import { TeamAthletesModal } from "../components/league/TeamAthletesModal";
import LeagueGroupChatFeed from "../components/leagues/LeagueGroupChat";
import { FantasyLeagueFixturesList } from "../components/league/FixturesList";
import { IFantasyLeague } from "../types/fantasyLeague";

export function LeagueScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [hasJoinedLeague, setHasJoinedLeague] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [activeTab, setActiveTab] = useState<"standings" | "chat" | "fixtures">(
    "standings"
  );
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo>({
    name: "Loading...",
    type: "Public",
    currentGameweek: 0,
    totalGameweeks: 0,
    totalTeams: 0,
    prizePool: "$0",
  });
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const [teamAthletes, setTeamAthletes] = useState<any[]>([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);

  // Get the league ID from URL params
  const { leagueId } = useParams<{ leagueId: string }>();
  const location = useLocation();
  const leagueFromState = location.state?.league;
  const navigate = useNavigate();

  // Set league name from state as soon as possible
  useEffect(() => {
    if (leagueFromState && leagueFromState.title) {
      console.log("Setting league name from state:", leagueFromState.title);
      setLeagueInfo((prev) => ({
        ...prev,
        name: leagueFromState.title,
      }));
    }
  }, [leagueFromState]);

  // Handle joining a league
  const handleJoinLeague = () => {
    // Navigate to team creation screen with league details
    if (leagueFromState && leagueId) {
      navigate(`/${leagueFromState.official_league_id}/create-team`, {
        state: { league: leagueFromState },
      });
    } else {
      console.error("League information is missing");
    }
  };

  // Function to view a team's details
  const viewTeam = (teamId: string) => {
    console.log("Viewing team:", teamId);
    // Navigate to team details page or open a modal
  };

  // Fetch participating teams when component mounts
  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!leagueId) return;
      if (!leagueFromState) {
        console.error("League information is missing from state");
        setError(
          "League information is missing. Please go back and try again."
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        console.log("leagueFromState", leagueFromState);
        console.log("League title:", leagueFromState.title);

        // Fetch participating teams
        const participatingTeams = await leagueService.fetchParticipatingTeams(
          leagueFromState.id
        );

        console.log("participatingTeams", participatingTeams);

        if (participatingTeams && participatingTeams.length > 0) {
          // Sort teams by score in descending order
          const sortedTeams = participatingTeams.sort(
            (a, b) => b.overall_score - a.overall_score
          );

          // Map to TeamStats format
          const mappedTeams: TeamStats[] = sortedTeams.map((team, index) => ({
            id: team.team_id,
            rank: index + 1,
            teamName: team.name || `Team ${index + 1}`,
            managerName: team.first_name + " " + team.last_name,
            totalPoints: team.overall_score || 0,
            weeklyPoints: team.overall_score || 0,
            lastRank: team.last_rank || index + 1,
            isUserTeam: false, // Will be set below if it matches
          }));

          // Get current user's team ID
          const currentUserTeamId = await getCurrentUserTeamId(
            participatingTeams
          );

          //console.log("currentUserTeamId", currentUserTeamId);

          // Mark user's team and get user's rank
          let userRank = 0;
          if (currentUserTeamId) {
            mappedTeams.forEach((team) => {
              if (team.id === currentUserTeamId) {
                team.isUserTeam = true;
                userRank = team.rank;
                setHasJoinedLeague(true);
              }
            });
          }

          //console.log("mappedTeams", mappedTeams);

          //console.log("Current user team ID:", currentUserTeamId);
          //console.log(
          //  "Teams with IDs:",
          //  mappedTeams.map((team) => ({ id: team.id, name: team.teamName }))
          //);
          // Check if any team has isUserTeam set to true
          //console.log(
          //  "User team found:",
          //  mappedTeams.some((team) => team.isUserTeam)
          //);

          setTeams(mappedTeams);

          console.log("leagueFromState", leagueFromState);

          setLeagueInfo({
            name: leagueFromState.title || "League",
            type: leagueFromState.is_private ? "Private" : "Public",
            currentGameweek: leagueFromState.current_gameweek || 0,
            totalGameweeks: leagueFromState.total_gameweeks || 0,
            totalTeams: mappedTeams.length,
            prizePool: formatPrizePool(leagueFromState),
            userRank: userRank || 0,
          });
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch league data:", err);
        setError("Failed to load league data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueData();
  }, [leagueId, leagueFromState]);

  // Helper function to get current user's team ID
  const getCurrentUserTeamId = async (
    participatingTeams: any[]
  ): Promise<string | null> => {
    if (!participatingTeams) return null;

    try {
      // Get user ID from token
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        return null;
      }

      // Extract user ID from token
      let userId: string;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub;
        if (!userId) {
          console.error("No user ID found in token");
          return null;
        }
      } catch (error) {
        console.error("Error extracting user ID from token:", error);
        return null;
      }

      // Find the team that belongs to this league
      const teamInLeague = participatingTeams.find(
        (team) => team.kc_id === userId
      );

      //console.log("teamInLeague", teamInLeague);

      if (teamInLeague) {
        // Return team_id instead of id to match what's used in mappedTeams
        return teamInLeague.team_id;
      }

      return null;
    } catch (error) {
      console.error("Error getting current user team ID:", error);
      return null;
    }
  };

  // Helper function to format prize pool
  const formatPrizePool = (league: any): string => {
    if (!league) return "$0";
    if (league.reward_description) return league.reward_description;
    return league.reward_type === "cash"
      ? `$${(league.entry_fee || 0) * (league.participants_count || 0)}`
      : "N/A";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "2",
      userName: "Sarah Johnson",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "Great game this weekend! My team performed really well 🎉",
      timestamp: "2:30 PM",
      reactions: [{ emoji: "👍", count: 2, userIds: ["1", "3"] }],
    },
    {
      id: "2",
      userId: "3",
      userName: "Mike Wilson",
      userAvatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      content: "Anyone watching the Crusaders match tonight?",
      timestamp: "2:35 PM",
      reactions: [],
    },
    {
      id: "3",
      userId: "1",
      userName: "You",
      userAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "I'll be watching! Should be an exciting match 🏉",
      timestamp: "2:40 PM",
      reactions: [{ emoji: "🔥", count: 1, userIds: ["2"] }],
    },
  ]);

  const currentUser: ChatUser = {
    id: "1",
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    isAdmin: true,
  };

  const fixtures: Fixture[] = [
    {
      id: "1",
      homeTeam: "Crusaders",
      awayTeam: "Blues",
      date: "2025-03-15",
      time: "19:45",
      venue: "Eden Park",
      competition: "Super Rugby",
    },
    {
      id: "2",
      homeTeam: "Hurricanes",
      awayTeam: "Chiefs",
      date: "2025-03-16",
      time: "17:30",
      venue: "Sky Stadium",
      competition: "Super Rugby",
    },
  ];

  useEffect(() => {
    const userTeam = teams.find((team) => team.isUserTeam);
    setShowJumpButton(Boolean(userTeam?.rank && userTeam.rank > 5));
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      reactions: [],
      isAdmin: currentUser.isAdmin,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.userIds.includes(currentUser.id)) {
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          userIds: r.userIds.filter(
                            (id) => id !== currentUser.id
                          ),
                        }
                      : r
                  )
                  .filter((r) => r.count > 0),
              };
            } else {
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count + 1,
                        userIds: [...r.userIds, currentUser.id],
                      }
                    : r
                ),
              };
            }
          } else {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                { emoji, count: 1, userIds: [currentUser.id] },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  // Handle team click
  const handleTeamClick = async (team: TeamStats) => {
    setSelectedTeam(team);
    setLoadingAthletes(true);

    try {
      // Fetch team athletes
      const athletes = await teamService.fetchTeamAthletes(team.id);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-850">
      <LeagueHeader
        leagueInfo={leagueInfo}
        onOpenSettings={() => setShowSettings(true)}
        isLoading={isLoading}
      >
        {!hasJoinedLeague && (
          <button
            onClick={handleJoinLeague}
            className="hidden lg:flex bg-white text-blue-600 font-semibold rounded-full px-4 py-2 shadow-md hover:bg-gray-100 transition"
          >
            Join This League
          </button>
        )}
      </LeagueHeader>

      <div className="container mx-auto px-4 sm:px-6 py-6 pb-20 lg:pb-6 max-w-3xl">
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
          {activeTab === "standings" && (
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
            />
          )}

          {activeTab === "chat" && (
            <LeagueGroupChatFeed league={leagueFromState as LeagueFromState} />
          )}

          {activeTab === "fixtures" && (
            <FantasyLeagueFixturesList  league={leagueFromState as IFantasyLeague} />
          )}
        </div>
      </div>

      {showSettings && (
        <LeagueSettings onClose={() => setShowSettings(false)} />
      )}

      {/* Team Athletes Modal */}
      {selectedTeam && (
        <TeamAthletesModal
          team={selectedTeam as TeamStats}
          athletes={teamAthletes}
          onClose={handleCloseModal}
          isLoading={loadingAthletes}
        />
      )}

      {/* Mobile CTA Button */}
      {!hasJoinedLeague && (
        <button
          onClick={handleJoinLeague}
          className="lg:hidden fixed bottom-20 inset-x-4 z-50 bg-blue-600 text-white font-semibold rounded-xl py-3 shadow-lg"
        >
          Join This League
        </button>
      )}
    </div>
  );
}
