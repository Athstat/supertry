import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Trophy, ChevronRight } from "lucide-react";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { useFetch } from "../hooks/useFetch";
import { isLeagueLocked, latestLeagueFetcher } from "../utils/leaguesUtils";
import LeagueLiveIndicator, { LeagueLiveIndicatorDot, LeagueLiveIndicatorSolid } from "../components/leagues/LeagueLiveIndicator";
import PostSignUpPickYourTeamCard from "../components/auth/post_sign_up/PickYourTeamCard";
import PostSignUpViewLeaderBoardCard from "../components/auth/post_sign_up/PostSignUpViewLeaderBoardCard";

export default function PostSignUpWelcomeScreen() {

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { data: latestLeague, error: latestLeagueError, isLoading: loading } = useFetch("latest-leagues", "", (key: string) => latestLeagueFetcher());

  // const handleWatchTutorial = () => {
  //   // Open YouTube tutorial in a new tab
  //   //window.open("https://youtube.com/scrummy-intro", "_blank");
  // };

  // const toggleDebug = () => {
  //   setIsDebug(!isDebug);
  // };

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
        <ScrummyLogo className="w-32 h-32 md:w-40 md:h-40 mb-6" />

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
          Welcome to Scrummy! 🎉 🏉
        </h1>

        <p className="w-full text-center mt-3 dark:text-slate-200" >
          You’ve officially joined the scrum! Don’t worry, it’s less bruises and more bragging rights from here.
        </p>

        {/* <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">
          Choose how you'd like to begin your journey.
        </p> */}

        {error && (
          <div className="mt-4 w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="w-full mt-8 space-y-4">
          {/* Tutorial Button */}
          {/* <motion.div
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
          </motion.div> */}

          <PostSignUpPickYourTeamCard league={latestLeague} />
          <PostSignUpViewLeaderBoardCard league={latestLeague} />

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
