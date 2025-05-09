import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Trophy, ChevronRight } from "lucide-react";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { activeLeaguesFilter, isLeagueOnTheClock } from "../utils/leaguesUtils";
import { IFantasyLeague } from "../types/fantasyLeague";
import { leagueService } from "../services/leagueService";

export default function PostSignUpWelcomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [latestLeague, setLatestLeague] = useState<IFantasyLeague | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDebug, setIsDebug] = useState(false);

  // Use the same approach as the dashboard HeroSection to get the league that's "on the clock"
  useEffect(() => {
    const fetchLeagueOnTheClock = async () => {
      try {
        setLoading(true);
        console.log("Fetching leagues on the clock...");

        // Get all leagues
        const allLeagues = await leagueService.getAllLeagues();

        if (allLeagues && allLeagues.length > 0) {
          // Filter for active leagues (same as dashboard)
          const activeLeagues = activeLeaguesFilter(allLeagues);

          // Define the same time window as in the HeroSection (2 days)
          const twoDays = 1000 * 60 * 60 * 24 * 2;

          // Filter for leagues on the clock (same as dashboard)
          const leaguesOnTheClock = activeLeagues.filter((l) => {
            return isLeagueOnTheClock(l, twoDays);
          });

          if (leaguesOnTheClock.length > 0) {
            // Use the first league on the clock (same as dashboard)
            console.log("League on the clock found:", leaguesOnTheClock[0]);
            setLatestLeague(leaguesOnTheClock[0]);
          } else if (activeLeagues.length > 0) {
            // Fallback to the first active league
            console.log(
              "No league on the clock, using first active league:",
              activeLeagues[0]
            );
            setLatestLeague(activeLeagues[0]);
          } else {
            // Ultimate fallback: use first league
            console.log(
              "No active leagues, using first available league:",
              allLeagues[0]
            );
            setLatestLeague(allLeagues[0]);
          }
        } else {
          setError("No leagues available. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching leagues:", err);
        setError("Unable to fetch league information");
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueOnTheClock();
  }, []);

  const handleWatchTutorial = () => {
    // Open YouTube tutorial in a new tab
    //window.open("https://youtube.com/scrummy-intro", "_blank");
  };

  const handleChoosePlayers = () => {
    if (!latestLeague) {
      setError("No active league available. Please try again later.");
      return;
    }

    console.log("Navigating to team creation with league:", latestLeague);

    // Navigate to team creation with the latest official league ID
    navigate(`/${latestLeague.official_league_id}/create-team`, {
      state: {
        league: latestLeague,
        from: "welcome",
      },
    });
  };

  const handleViewLeaderboard = () => {
    if (!latestLeague) {
      setError("No active league available. Please try again later.");
      return;
    }

    console.log("Navigating to leaderboard with league:", latestLeague);

    // Navigate to league screen with league info as state
    // Include "from" parameter to indicate we're coming from welcome screen
    navigate(`/league/${latestLeague.official_league_id}`, {
      state: {
        league: latestLeague,
        from: "welcome",
      },
    });
  };

  const toggleDebug = () => {
    setIsDebug(!isDebug);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-850">
        <Loader className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-850 px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <ScrummyLogo className="w-32 h-32 md:w-40 md:h-40" />

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
          Welcome to Scrummy!
        </h1>

        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 text-center">
          Choose how you'd like to begin your journey.
        </p>

        {error && (
          <div className="mt-4 w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="w-full mt-8 space-y-4">
          {/* Tutorial Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: 0,
                },
              },
            }}
            className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 },
            }}
            onClick={handleWatchTutorial}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                  <ChevronRight
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 className="font-semibold text-lg dark:text-white">
                  Watch Tutorial
                </h3>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </motion.div>

          {/* Choose Players Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: 0.1,
                },
              },
            }}
            className={`bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-xl p-4 hover:shadow-md transition-shadow ${
              latestLeague ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
            }`}
            whileHover={
              latestLeague
                ? {
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 },
                  }
                : {}
            }
            onClick={latestLeague ? handleChoosePlayers : undefined}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-3">
                  <Trophy
                    size={20}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h3 className="font-semibold dark:text-white">
                  Choose Your Players
                </h3>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </motion.div>

          {/* View Leaderboard Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: 0.2,
                },
              },
            }}
            className={`bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-xl p-4 hover:shadow-md transition-shadow ${
              latestLeague ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
            }`}
            whileHover={
              latestLeague
                ? {
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 },
                  }
                : {}
            }
            onClick={latestLeague ? handleViewLeaderboard : undefined}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
                  <Trophy
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <h3 className="font-semibold dark:text-white">
                  View Leaderboard
                </h3>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </motion.div>

          {/* Dashboard Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: 0.3,
                },
              },
            }}
            className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 },
            }}
            onClick={() => navigate("/dashboard")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                  <ChevronRight
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="font-semibold dark:text-white">
                  Go to Dashboard
                </h3>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
