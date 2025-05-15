import React from "react";
import {
  Trophy,
  Users,
  Loader,
  Award,
  ChevronLeft,
  Zap,
  ChevronRight,
} from "lucide-react";
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

      {/* Team Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-700 via-primary-800 rounded-xl p-4 mb-6 shadow-md">
        {/* Team Name */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {team.name}
        </h1>

        {/* First Row: Rank Badge */}
        <div className="flex flex-wrap items-center gap-4 mb-2"></div>

        {/* Second Row: Points, Player Count, League Info */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-white to-gray-200 via-gray-50 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-base mr-0.5">
                {rank === 1 ? (
                  "🥇"
                ) : rank === 2 ? (
                  "🥈"
                ) : rank === 3 ? (
                  "🥉"
                ) : (
                  <Trophy
                    size={18}
                    className="text-blue-500 dark:text-blue-400"
                  />
                )}
              </span>
              <span className="font-medium text-sm text-gray-800">
                Rank #{rank ?? " –"}
              </span>
            </div>
          </div>
          {/* Points Badge */}
          <div className="inline-flex items-center">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-white to-gray-200 via-gray-50 px-3 py-1.5 rounded-full shadow-sm">
              <Zap size={18} className="text-orange-500 shrink-0" />
              <span className="font-medium text-sm text-gray-800">
                {Math.floor(team.round_score ?? totalPoints ?? 0)} pts
              </span>
            </div>
          </div>

          {/* Player Count */}
          <div className="flex items-center gap-1.5 text-sm text-white">
            <Users size={16} className="text-white shrink-0" />
            <span className="whitespace-nowrap">{athletesCount} Players</span>
          </div>

          {/* League Info */}
          {leagueInfo && (
            <div className="flex items-center gap-1.5 text-sm text-white">
              <Award size={16} className="text-white shrink-0" />
              <button
                onClick={() => {
                  if (leagueInfo) {
                    navigate(`/league/${leagueInfo.official_league_id}`, {
                      state: { league: leagueInfo },
                    });
                  }
                }}
                className="whitespace-nowrap text-white hover:underline font-medium flex group"
              >
                <span>{leagueInfo.title || "League"}</span>
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-0.5 transition-transform ml-1"
                />
              </button>
            </div>
          )}

          {/* Loading League */}
          {fetchingLeague && !leagueInfo && (
            <div className="flex items-center gap-1.5 text-sm text-white">
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
