import React, { useState, useEffect } from "react";
import { Users, Trophy, ChevronLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leagueService } from "../services/leagueService";
import { teamService } from "../services/teamService";
import { IFantasyLeague } from "../types/fantasyLeague";
import { motion } from "framer-motion";

// Import components
import { LeagueCard } from "../components/leagues/LeagueCard";

export function JoinLeagueScreen() {
  const navigate = useNavigate();
  const [availableLeagues, setAvailableLeagues] = useState<IFantasyLeague[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamCounts, setTeamCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Fetch available leagues
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setIsLoading(true);
        const leagues = await leagueService.getAllLeagues();

        // Filter leagues based on is_open status
        const available = leagues.filter(
          (league) => league.is_open && !league.has_ended
        );

        setAvailableLeagues(available);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch leagues:", err);
        setError("Failed to load leagues. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  // Fetch team counts for each league
  useEffect(() => {
    const fetchTeamCounts = async () => {
      if (availableLeagues.length === 0) return;

      setIsLoadingCounts(true);
      const counts: Record<string, number> = {};

      try {
        // Fetch team counts for each league
        for (const league of availableLeagues) {
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
  }, [availableLeagues]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle league click
  const handleLeagueClick = (league: IFantasyLeague) => {
    navigate(`/league/${league.official_league_id}`, {
      state: { league },
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
          Leagues
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading available leagues...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : availableLeagues.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
            No leagues available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new leagues
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/40 rounded-xl shadow-sm my-6 p-4 sm:p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
            <Trophy size={24} className="text-primary-500" />
            Available Leagues
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {availableLeagues.map((league, index) => (
              <LeagueCard
                key={league.id}
                league={league}
                onLeagueClick={handleLeagueClick}
                teamCount={teamCounts[league.id]}
                isLoading={isLoadingCounts}
                custom={index}
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
