import { Loader } from "lucide-react";
import { useEffect } from "react";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { useFetch } from "../hooks/useFetch";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { authService } from "../services/authService";
import { latestLeagueFetcher } from "../utils/leaguesUtils";
import PostSignUpPickYourTeamCard from "../components/auth/post_sign_up/PickYourTeamCard";
import PostSignUpViewLeaderBoardCard from "../components/auth/post_sign_up/PostSignUpViewLeaderBoardCard";
import PostSignUpDashboardButton from "../components/auth/post_sign_up/PostSignUpDashboardButton";
import PostSignUpTutorialButton from "../components/auth/post_sign_up/PostSignUpTutorialButton";

export default function PostSignUpWelcomeScreen() {
  const { requestPermissions, isSupported } = usePushNotifications();

  const { 
    data: latestLeague, 
    isLoading: loading, error 
  } = useFetch("latest-leagues", "", (_) => latestLeagueFetcher());

  // Request push notification permission for first-time guest users
  useEffect(() => {
    const checkAndRequestPushPermissions = async () => {
      // Only proceed if the bridge is available (in mobile app)
      if (!isSupported) {
        console.log("Push notifications not supported (not in mobile app)");
        return;
      }

      // Check if this is a guest account
      const isGuest = authService.isGuestAccount();
      if (!isGuest) {
        console.log("Not a guest account, skipping push permission request");
        return;
      }

      // Check if this is a first-time login by checking localStorage
      const hasPromptedForPush = localStorage.getItem("has_prompted_push_permission");
      if (hasPromptedForPush) {
        console.log("Already prompted for push permissions");
        return;
      }

      // Mark that we've prompted for push permissions
      localStorage.setItem("has_prompted_push_permission", "true");

      // Request push notification permissions
      try {
        console.log("Requesting push notification permissions for new guest user");
        const granted = await requestPermissions();
        console.log("Push permission request result:", granted);
      } catch (error) {
        console.error("Error requesting push permissions:", error);
      }
    };

    // Run the check after a short delay to ensure the screen is fully loaded
    const timeoutId = setTimeout(() => {
      checkAndRequestPushPermissions();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isSupported, requestPermissions]);

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
          You've officially joined the scrum! Don't worry, it's less bruises and more bragging rights from here.
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
