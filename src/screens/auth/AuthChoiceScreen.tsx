import { useNavigate } from 'react-router-dom';
import { motion, MotionProps } from 'framer-motion';
import ScrummyLogo from '../../components/branding/scrummy_logo';
import { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { isFirstVisitCompleted, markFirstVisitCompleted } from '../../utils/firstVisitUtils';

// Button animation variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.01,
    transition: { type: 'linear', stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.98 },
};

// Create a typed motion button component
const MotionButton = motion.button as React.ComponentType<
  MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

export function AuthChoiceScreen() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      await authService.createGuestUser();

      // Update auth context
      await checkAuth();

      // Check if this is the first completed visit
      const firstVisitCompleted = isFirstVisitCompleted();

      // Navigate to appropriate screen
      if (firstVisitCompleted) {
        navigate('/dashboard');
      } else {
        // Mark first visit as completed since we're creating a guest account
        markFirstVisitCompleted();
        navigate('/post-signup-welcome');
      }
    } catch (error) {
      console.error('Guest login failed:', error);
      // If guest login fails, still navigate to dashboard as fallback
      navigate('/dashboard');
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
        <ScrummyLogo className="w-60 h-60 md:w-60 md:h-60 -mb-5" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Scrummy
          </h1>
          <p className="mt-3 lg:text-xl text-gray-600 dark:text-gray-300 text-center">
            You've officially joined the scrum! Don't worry, it's less bruises and more bragging
            rights from here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full space-y-3 flex flex-col items-center"
        >
          <MotionButton
            onClick={() => navigate('/signup')}
            className="w-[90%] border border-gray-300 dark:border-gray-700 bg-gradient-to-r from-primary-700 to-primary-600 via-primary-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-600 hover:via-primary-650 transition-colors"
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Create Account
          </MotionButton>

          <MotionButton
            onClick={() => navigate('/signin')}
            className="w-[90%] bg-gradient-to-r from-green-700 to-green-600 via-green-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-600 hover:via-green-650 transition-colors"
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Login
          </MotionButton>

          <MotionButton
            onClick={handleGuestLogin}
            className="w-full text-gray-600 dark:text-gray-400 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors flex justify-center items-center"
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            Continue without an account
          </MotionButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
