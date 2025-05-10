import React, { useState, useEffect } from "react";
import { Trophy, Loader, Users, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LeagueCard } from "../leagues/LeagueCard";
import { ActiveLeaguesSectionProps } from "./types";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { leagueService } from "../../services/leagueService";
import { fantasyTeamService } from "../../services/teamService";
import { activeLeaguesFilter } from "../../utils/leaguesUtils";
import { format } from "date-fns";

export const ActiveLeaguesSection: React.FC<ActiveLeaguesSectionProps> = ({
  leagues,
  isLoading,
  onViewLeague,
}) => {
  const navigate = useNavigate();
  const [teamCounts, setTeamCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [userTeams, setUserTeams] = useState<Record<string, boolean>>({});
  const [isLoadingUserTeams, setIsLoadingUserTeams] = useState(false);

  // Fetch team counts for each league
  useEffect(() => {
    const fetchTeamCounts = async () => {
      if (leagues.length === 0) return;

      setIsLoadingCounts(true);
      const counts: Record<string, number> = {};

      try {
        // Fetch team counts for each league
        for (const league of leagues.slice(0, 3)) {
          const teams = await leagueService.fetchParticipatingTeams(league.id);
          counts[league.id] = teams.length;
        }

        setTeamCounts(counts);
      } catch (error) {
        console.error("Failed to fetch team counts:", error);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchTeamCounts();
  }, [leagues]);

  // Fetch user's teams to check which leagues they've joined
  useEffect(() => {
    const fetchUserTeams = async () => {
      if (leagues.length === 0) return;

      setIsLoadingUserTeams(true);
      const joinedLeagues: Record<string, boolean> = {};

      try {
        // Fetch all teams for the user
        const teams = await fantasyTeamService.fetchUserTeams();

        // Map of joined league IDs
        leagues.forEach((league) => {
          // Check if any team's league_id matches the current league's id
          const hasJoined = teams.some((team) => team.league_id === league.id);
          joinedLeagues[league.id] = hasJoined;
        });

        setUserTeams(joinedLeagues);
      } catch (error) {
        console.error("Failed to fetch user teams:", error);
      } finally {
        setIsLoadingUserTeams(false);
      }
    };

    fetchUserTeams();
  }, [leagues]);

  const handleLeagueClick = (league: IFantasyLeague) => {
    onViewLeague(league);
  };

  const activeLeagues = activeLeaguesFilter(leagues);

  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
        <Trophy size={24} className="text-primary-500" />
        Active Leagues
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : leagues.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No active leagues available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeLeagues.slice(0, 3).map((league, index) => (
            <LeagueCard
              key={league.id}
              league={league}
              onLeagueClick={handleLeagueClick}
              teamCount={teamCounts[league.id]}
              isLoading={isLoadingCounts}
              custom={index}
              isJoined={userTeams[league.id]}
            />
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
  );
};
