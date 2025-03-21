import React, { useEffect, useState } from "react";
import { PlusCircle, Users, Star, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { teamService } from "../services/teamService";
import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../types/fantasyTeamAthlete";

export function MyTeamsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamCreated, teamName, leagueId } = location.state || {};

  const [teams, setTeams] = useState<IFantasyClubTeam[]>([]);
  const [teamsWithAthletes, setTeamsWithAthletes] = useState<
    Map<string, IFantasyTeamAthlete[]>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(
    Boolean(teamCreated)
  );

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const userTeams = await teamService.fetchUserTeams();
        setTeams(userTeams);

        // Fetch athletes for each team
        const athletesMap = new Map<string, IFantasyTeamAthlete[]>();

        for (const team of userTeams) {
          try {
            const athletes = await teamService.fetchTeamAthletes(team.id);
            athletesMap.set(team.id, athletes);
          } catch (err) {
            console.error(`Failed to fetch athletes for team ${team.id}:`, err);
            athletesMap.set(team.id, []);
          }
        }

        setTeamsWithAthletes(athletesMap);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Failed to load your teams. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();

    // Auto-hide success toast after 5 seconds
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTeamClick = (teamId: string) => {
    // Pass the team and its athletes to the MyTeamScreen
    const team = teams.find((t) => t.id === teamId);
    const athletes = teamsWithAthletes.get(teamId) || [];

    navigate(`/my-team/${teamId}`, {
      state: {
        team,
        athletes,
      },
    });
  };

  const toggleFavorite = async (
    teamId: string,
    isFavorite: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // In a real app, you would call an API to update the favorite status
    // For now, we'll just update the local state
    setTeams(
      teams.map((team) =>
        team.id === teamId ? { ...team, isFavorite: !isFavorite } : team
      )
    );
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">My Teams</h1>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg shadow-md flex items-center gap-2 animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span>Team "{teamName}" successfully created!</span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="ml-2 text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Users className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
            No Teams Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any fantasy teams yet.
          </p>
          <button
            onClick={() => navigate("/leagues")}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
          >
            <PlusCircle size={20} />
            Join a League
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => handleTeamClick(team.id)}
              className="relative flex items-center justify-between p-4 rounded-xl 
                bg-gray-100/80 dark:bg-gray-800/40 hover:bg-gray-300/30 dark:hover:bg-dark-800/60
                transition-all duration-200 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleTeamClick(team.id);
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold dark:text-gray-100">
                      {team.name}
                    </h3>
                    <button
                      onClick={(e) =>
                        toggleFavorite(team.id, Boolean(team.isFavorite), e)
                      }
                      className={`text-gray-400 hover:text-yellow-400 transition-colors ${
                        team.isFavorite ? "text-yellow-400" : ""
                      }`}
                      aria-label={
                        team.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Star
                        size={18}
                        fill={team.isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-400">
                      <Users size={16} className="shrink-0" />
                      <span>
                        {teamsWithAthletes.get(team.id)?.length || 0} Players
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-lg font-bold text-primary-400">
                  {team.score?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-400">
                  {team.rank ? `Rank #${team.rank}` : "Not ranked yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
