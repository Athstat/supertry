import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Users,
  Trophy,
  Award,
  PlusCircle,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TeamCard } from "../components/TeamCard";
import { LeagueCard } from "../components/LeagueCard";
import { teamService } from "../services/teamService";
import { leagueService } from "../services/leagueService";
import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../types/fantasyLeague";

export function DashboardScreen() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<IFantasyClubTeam[]>([]);
  const [teamsWithAthletes, setTeamsWithAthletes] = useState<
    Map<string, IFantasyTeamAthlete[]>
  >(new Map());
  const [leagues, setLeagues] = useState<IFantasyLeague[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's teams
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        setIsLoadingTeams(true);
        // Get teams directly using fetchUserTeams
        const userTeams = await teamService.fetchUserTeams();
        setTeams(userTeams);
        console.log("userTeams", userTeams);

        // Fetch athletes for each team
        const athletesMap = new Map<string, IFantasyTeamAthlete[]>();

        for (const team of userTeams) {
          const athletes = await teamService.fetchTeamAthletes(team.id);
          athletesMap.set(team.id, athletes);
        }

        setTeamsWithAthletes(athletesMap);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Failed to load your teams. Please try again later.");
      } finally {
        setIsLoadingTeams(false);
      }
    };

    fetchUserTeams();
  }, []);

  // Fetch available leagues
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setIsLoadingLeagues(true);
        const allLeagues = await leagueService.getAllLeagues();

        // Filter leagues based on is_open status (same as JoinLeagueScreen)
        const availableLeagues = allLeagues.filter(
          (league) => league.is_open && !league.has_ended
        );
        console.log("availableLeagues", availableLeagues);
        setLeagues(availableLeagues);
      } catch (err) {
        console.error("Failed to fetch leagues:", err);
        setError("Failed to load leagues. Please try again later.");
      } finally {
        setIsLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleJoinLeague = (league: IFantasyLeague) => {
    navigate(`/${league.official_league_id}/create-team`, {
      state: { league },
    });
  };

  const handleTeamClick = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    const athletes = teamsWithAthletes.get(teamId) || [];

    navigate(`/my-team/${teamId}`, {
      state: { team, athletes },
    });
  };

  // Calculate team points
  const getTeamPoints = (teamId: string): number => {
    const athletes = teamsWithAthletes.get(teamId) || [];
    return athletes.reduce((sum, athlete) => sum + (athlete.score || 0), 0);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Weekly Rugby Fantasy Leagues
        </h1>
        <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
          Create your dream team and compete in weekly leagues
        </p>
        <button
          onClick={() => navigate("/leagues")}
          className="bg-white text-primary-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          Join Weekly League <ChevronRight size={20} />
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Teams Section */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
                <Users size={24} className="text-primary-500" />
                My Teams
              </h2>
              <button
                onClick={() => navigate("/leagues")}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 text-sm font-medium"
              >
                <PlusCircle size={18} />
                Create Team
              </button>
            </div>

            {isLoadingTeams ? (
              <div className="flex justify-center py-8">
                <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>You don't have any teams yet.</p>
                <button
                  onClick={() => navigate("/leagues")}
                  className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Your First Team
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamClick(team.id)}
                    className="bg-gray-50 dark:bg-dark-800/60 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg dark:text-white">
                        {team.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {team.rank ? `#${team.rank}` : "Not ranked"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                      <span>
                        {(teamsWithAthletes.get(team.id) || []).length} Players
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Points
                      </span>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {getTeamPoints(team.id)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Leagues Section */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
              <Trophy size={24} className="text-primary-500" />
              Active Leagues
            </h2>

            {isLoadingLeagues ? (
              <div className="flex justify-center py-8">
                <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : leagues.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No active leagues available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leagues.slice(0, 3).map((league) => (
                  <div
                    key={league.id}
                    className="bg-gray-50 dark:bg-dark-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold dark:text-white">
                        {league.title}
                      </h3>
                      <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                        {league.status || "Live"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Users size={16} />
                      <span>
                        {league.participants_count || "0"}/
                        {league.max_participants || "∞"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleJoinLeague(league)}
                      className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Join Now
                    </button>
                  </div>
                ))}

                {leagues.length > 3 && (
                  <button
                    onClick={() => navigate("/leagues")}
                    className="w-full text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 py-2 text-sm font-medium"
                  >
                    View All Leagues
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
