import React from "react";
import { Users, Trophy, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MyTeamsSectionProps } from "./types";

export const MyTeamsSection: React.FC<MyTeamsSectionProps> = ({
  teams,
  teamsWithAthletes,
  isLoading,
  error,
}) => {
  const navigate = useNavigate();

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
    <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Users size={24} className="text-primary-500" />
          My Teams
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>
            You don't have any teams yet.
            <br />
            Join a league to create your first team.
          </p>
          <button
            onClick={() => navigate("/leagues")}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Join a League
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.slice(0, 2).map((team) => (
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
                      Not ranked
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

          {teams.length > 2 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/my-teams")}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
              >
                View All Teams ({teams.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
