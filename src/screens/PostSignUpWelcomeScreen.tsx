import { Loader } from "lucide-react";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { useFetch } from "../hooks/useFetch";
import { latestLeagueFetcher } from "../utils/leaguesUtils";
import PostSignUpPickYourTeamCard from "../components/auth/post_sign_up/PickYourTeamCard";
import PostSignUpViewLeaderBoardCard from "../components/auth/post_sign_up/PostSignUpViewLeaderBoardCard";
import PostSignUpDashboardButton from "../components/auth/post_sign_up/PostSignUpDashboardButton";
import PostSignUpTutorialButton from "../components/auth/post_sign_up/PostSignUpTutorialButton";

export default function PostSignUpWelcomeScreen() {

  const { 
    data: latestLeague, 
    isLoading: loading, error 
  } = useFetch("latest-leagues", "", (_) => latestLeagueFetcher());

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

          <PostSignUpTutorialButton />
          <PostSignUpPickYourTeamCard league={latestLeague} />
          <PostSignUpViewLeaderBoardCard league={latestLeague} />
          <PostSignUpDashboardButton />

        </div>
      </div>
    </div>
  );
}
