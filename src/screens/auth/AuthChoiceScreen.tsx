import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ScrummyLogo from "../../components/branding/scrummy_logo";
import { useState } from "react";
import { authService } from "../../services/authService";

export function AuthChoiceScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      await authService.createGuestUser();
      navigate("/dashboard");
    } catch (error) {
      console.error("Guest login failed:", error);
      // If guest login fails, still navigate to welcome as fallback
    } finally {
      setIsLoading(false);
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
        <ScrummyLogo className="w-32 h-32 md:w-40 md:h-40 mb-8" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Scrummy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your teams, your scores
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full space-y-3"
        >
          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors"
            disabled={isLoading}
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/signin")}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            Login
          </button>

          <button
            onClick={handleGuestLogin}
            className="w-full text-gray-600 dark:text-gray-400 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            Continue without an account
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}