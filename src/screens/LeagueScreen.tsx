import React, { useState, useEffect } from "react";
import { LeagueHeader } from "../components/league/LeagueHeader";
import { LeagueStandings } from "../components/league/LeagueStandings";
import { FixturesList } from "../components/league/FixturesList";
import { LeagueInsights } from "../components/league/LeagueInsights";
import { LeagueSettings } from "../components/league/LeagueSettings";
import { ChatFeed } from "../components/league/chat/ChatFeed";
import { TeamStats, Fixture, LeagueInfo } from "../types/league";
import { ChatMessage, ChatUser } from "../types/chat";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { leagueService } from "../services/leagueService";
import { teamService } from "../services/teamService";

export function LeagueScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
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

  // Get the league ID from URL params
  const { leagueId } = useParams<{ leagueId: string }>();

  // Fetch participating teams when component mounts
  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!leagueId) return;

      try {
        setIsLoading(true);

        // Fetch participating teams
        const participatingTeams = await leagueService.fetchParticipatingTeams(
          leagueId
        );

        //console.log("participatingTeams", participatingTeams);

        if (participatingTeams && participatingTeams.length > 0) {
          // Sort teams by score in descending order
          const sortedTeams = participatingTeams.sort(
            (a, b) => b.score - a.score
          );

          // Map to TeamStats format
          const mappedTeams: TeamStats[] = sortedTeams.map((team, index) => ({
            id: team.team_id,
            rank: index + 1,
            teamName: team.name || `Team ${index + 1}`,
            managerName: team.manager_name || "Unknown Manager",
            totalPoints: team.overall_score || 0,
            weeklyPoints: team.score || 0,
            lastRank: team.last_rank || index + 1,
            isUserTeam: false, // Will be set below if it matches
          }));

          // Get current user's team ID
          const currentUserTeamId = await getCurrentUserTeamId(leagueId);

          // Mark user's team and get user's rank
          let userRank = 0;
          if (currentUserTeamId) {
            mappedTeams.forEach((team) => {
              if (team.id === currentUserTeamId) {
                team.isUserTeam = true;
                userRank = team.rank;
              }
            });
          }

          setTeams(mappedTeams);

          // Update league info
          const leagueDetails = participatingTeams[0]?.league || {};
          console.log("leagueDetails", leagueDetails);
          setLeagueInfo({
            name: leagueDetails.title || "League",
            type: leagueDetails.is_private ? "Private" : "Public",
            currentGameweek: leagueDetails.current_gameweek || 0,
            totalGameweeks: leagueDetails.total_gameweeks || 0,
            totalTeams: mappedTeams.length,
            prizePool: formatPrizePool(leagueDetails),
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
  }, [leagueId]);

  // Helper function to get current user's team ID
  const getCurrentUserTeamId = async (
    leagueId: string
  ): Promise<string | null> => {
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

      // Fetch user teams from the teamService
      const userTeams = await teamService.fetchUserTeams(leagueId);

      // Find the team that belongs to this league
      const teamInLeague = userTeams.find(
        (team) => team.league_id === leagueId
      );

      if (teamInLeague) {
        return teamInLeague.id;
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

  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-850">
      <LeagueHeader
        leagueInfo={leagueInfo}
        onOpenSettings={() => setShowSettings(true)}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
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
            />
            {/* <ChatFeed
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onReactToMessage={handleReactToMessage}
            /> */}
          </div>

          {/* <div className="lg:col-span-5 space-y-6">
            <FixturesList fixtures={fixtures} />
            <LeagueInsights />
          </div> */}
        </div>
      </div>

      {showSettings && (
        <LeagueSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
