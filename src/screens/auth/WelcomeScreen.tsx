import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Loader } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import ScrummyLogo from "../../components/branding/scrummy_logo";
import { markFirstVisitCompleted } from "../../utils/firstVisitUtils";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleGetStarted = async () => {
    console.log("Starting guest account creation...");
    setIsCreatingGuest(true);
    setError(null);
    
    try {
      // Create and login guest user
      console.log("Calling authService.createGuestUser()...");
      const loginResult = await authService.authenticateAsGuestUser();
      
      console.log("Guest user created and logged in successfully", loginResult);
      
      // The createGuestUser method already logs in the user and sets tokens
      // Now we need to update the auth context
      console.log("Updating auth state...");
      const authUpdated = await checkAuth();
      
      console.log("Auth check result:", authUpdated);
      
      // Store that this was the first visit completed
      markFirstVisitCompleted();
      
      // Navigate to post-signup-welcome
      if (authUpdated || localStorage.getItem("access_token")) {
        console.log("Navigating to post-signup welcome...");
        navigate("/post-signup-welcome");
      } else {
        throw new Error("Failed to authenticate after guest account creation");
      }
    } catch (err: any) {
      console.error("Error creating guest account:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      setError(err.message || "Failed to get started. Please try again.");
      setIsCreatingGuest(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-850 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <ScrummyLogo className="w-60 h-60 md:w-60 md:h-60 -mb-5" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
            Welcome to Scrummy
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="mt-3 lg:text-xl text-gray-600 dark:text-gray-300 text-center">
            You've officially joined the scrum! Don't worry, it's less bruises
            and more bragging rights from here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full mt-12 items-center justify-center flex flex-col"
        >
          <motion.button
            whileHover={
              !isCreatingGuest
                ? {
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 },
                  }
                : {}
            }
            onClick={handleGetStarted}
            className="w-[90%] bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
            {...(isCreatingGuest ? { disabled: true } : {})}
          >
            {isCreatingGuest ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                <span>Getting Started...</span>
              </>
            ) : (
              <>
                <span>Get Started</span>
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center"
          >
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary-600 hover:underline font-medium"
            >
              Sign In
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}