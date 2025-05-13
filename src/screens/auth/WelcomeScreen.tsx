import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ScrummyLogo from "../../components/branding/scrummy_logo";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

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

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-850 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <ScrummyLogo className="w-32 h-32 md:w-40 md:h-40 mb-6" />

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
            You’ve officially joined the scrum! Don’t worry, it’s less bruises and more bragging rights from here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full mt-12 items-center justify-center flex"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 },
            }}
            onClick={handleGetStarted}
            className="w-[90%] bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center"
          >
            <span>Get Started</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
