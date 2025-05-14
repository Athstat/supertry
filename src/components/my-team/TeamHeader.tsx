import React from "react";
import { Trophy, Users, Loader, Award, ChevronLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IFantasyClubTeam } from "../../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../../types/fantasyLeague";

interface TeamHeaderProps {
  team: IFantasyClubTeam;
  athletesCount: number;
  totalPoints: number;
  leagueInfo: IFantasyLeague | null;
  fetchingLeague: boolean;
  rank?: number;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  team,
  athletesCount,
  totalPoints,
  leagueInfo,
  fetchingLeague,
  rank,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  console.log("rank", rank);
  console.log("totalPoints", totalPoints);
  console.log("round_score", team.round_score);

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
        <span className="text-sm font-medium">Go Back</span>
      </button>

      {/* Hero Team Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-dark-800/60 dark:to-dark-700/60 rounded-xl p-6 mb-6 shadow-md text-center">
        {/* Team Name */}
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100 mb-4">
          {team.name}
        </h1>

        {/* Rank and Score Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          {/* Rank Badge with Medal */}
          <div className="relative inline-flex items-center">
            <div className="absolute inset-0 bg-yellow-400 dark:bg-yellow-500 rounded-full opacity-20 animate-[pulse_2s_ease-in-out_infinite]"></div>
            <div className="relative flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-dark-700/70 dark:to-dark-700/90 px-4 py-2 rounded-full shadow-sm">
              <span className="text-xl mr-1">
                {rank === 1 ? (
                  "🥇"
                ) : rank === 2 ? (
                  "🥈"
                ) : rank === 3 ? (
                  "🥉"
                ) : (
                  <Trophy
                    size={22}
                    className="text-blue-500 dark:text-blue-400 animate-pulse"
                  />
                )}
              </span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                Rank #{rank ?? " –"}
              </span>
            </div>
          </div>

          {/* Round Score Badge */}
          <div className="relative inline-flex items-center">
            <div className="absolute inset-0 bg-orange-400 dark:bg-orange-500 rounded-full opacity-10 animate-[pulse_2.5s_ease-in-out_infinite]"></div>
            <div className="relative flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-dark-700/70 dark:to-dark-700/90 px-4 py-2 rounded-full shadow-sm">
              <Zap size={22} className="text-orange-500 shrink-0" />
              <span
                className="font-bold text-gray-800 dark:text-gray-200"
                style={{ textShadow: "0 0 8px rgba(255, 153, 0, 0.4)" }}
              >
                {Math.floor(team.round_score ?? totalPoints ?? 0)} pts
              </span>
            </div>
          </div>
        </div>

        {/* Additional Team Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Users
              size={18}
              className="text-primary-700 dark:text-primary-500 shrink-0"
            />
            <span className="whitespace-nowrap">{athletesCount} Players</span>
          </div>

          {leagueInfo && (
            <div className="flex items-center gap-1.5">
              <Award size={18} className="text-blue-500 shrink-0" />
              <button
                onClick={() => {
                  if (leagueInfo) {
                    navigate(`/league/${leagueInfo.official_league_id}`, {
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
            <div className="flex items-center gap-1.5">
              <Loader
                size={16}
                className="animate-spin text-blue-500 shrink-0"
              />
              <span className="whitespace-nowrap">Loading league...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
