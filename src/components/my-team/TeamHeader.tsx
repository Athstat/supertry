import React from "react";
import { Trophy, Users, Loader, Award, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IFantasyClubTeam } from "../../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../../types/fantasyLeague";

interface TeamHeaderProps {
  team: IFantasyClubTeam;
  athletesCount: number;
  totalPoints: number;
  leagueInfo: IFantasyLeague | null;
  fetchingLeague: boolean;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  team,
  athletesCount,
  totalPoints,
  leagueInfo,
  fetchingLeague,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/my-teams");
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-500 mb-6 group transition-colors"
        aria-label="Back to My Teams"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleBack()}
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        <span className="text-sm font-medium">My Teams</span>
      </button>

      {/* Team Header */}
      <div className="bg-white dark:bg-dark-800/40 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Team Name and Stats */}
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold dark:text-gray-100">
              {team.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <Trophy size={18} className="text-yellow-500 shrink-0" />
                <span className="whitespace-nowrap">
                  {(team as any).rank
                    ? `Rank ${(team as any).rank}`
                    : "Not ranked yet"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <Users
                  size={18}
                  className="text-primary-700 dark:text-primary-500 shrink-0"
                />
                <span className="whitespace-nowrap">
                  {athletesCount} Players
                </span>
              </div>
              {leagueInfo && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Award size={18} className="text-blue-500 shrink-0" />
                  <button
                    onClick={() => {
                      if (leagueInfo) {
                        navigate(`/leagues/${leagueInfo.id}`, {
                          state: { league: leagueInfo },
                        });
                      }
                    }}
                    className="whitespace-nowrap text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {leagueInfo.title || "League"}
                  </button>
                </div>
              )}
              {fetchingLeague && !leagueInfo && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Loader
                    size={16}
                    className="animate-spin text-blue-500 shrink-0"
                  />
                  <span className="whitespace-nowrap">Loading league...</span>
                </div>
              )}
            </div>
          </div>

          {/* Points Display */}
          <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 bg-gray-50 dark:bg-dark-700/40 p-2 sm:p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Game Points
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-500 flex items-center">
              <span className="mr-1.5 text-yellow-500 text-sm font-semibold">
                pts
              </span>
              {totalPoints}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
