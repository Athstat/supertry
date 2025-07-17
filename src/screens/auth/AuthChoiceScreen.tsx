import { useNavigate } from 'react-router-dom';
import { motion, MotionProps } from 'framer-motion';
import ScrummyLogo from '../../components/branding/scrummy_logo';
import { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { isFirstVisitCompleted, markFirstVisitCompleted } from '../../utils/firstVisitUtils';
import { getDeviceId } from '../../utils/deviceIdUtils';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

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
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google sign-in failed. Please try again.');
      return;
    }

    try {
      setError(null);
      const result = await authService.googleOAuth(credentialResponse.credential);

      if (result.error) {
        setError(result.error.message || 'Google sign-in failed');
        return;
      }

      // Update auth context
      await checkAuth();

      // Check if this is the first completed visit
      const firstVisitCompleted = isFirstVisitCompleted();

      // Navigate to appropriate screen
      if (firstVisitCompleted) {
        navigate('/dashboard');
      } else {
        markFirstVisitCompleted();
        navigate('/post-signup-welcome');
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setError('Google sign-in failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in failed');
    setError('Google sign-in failed. Please try again.');
  };

  const handleAppleSuccess = async (response: any) => {
    if (!response.authorization || !response.authorization.id_token) {
      setError('Apple sign-in failed. Please try again.');
      return;
    }

    try {
      setError(null);
      const result = await authService.appleOAuth(response.authorization.id_token);

      if (result.error) {
        setError(result.error.message || 'Apple sign-in failed');
        return;
      }

      // Update auth context
      await checkAuth();

      // Check if this is the first completed visit
      const firstVisitCompleted = isFirstVisitCompleted();

      // Navigate to appropriate screen
      if (firstVisitCompleted) {
        navigate('/dashboard');
      } else {
        markFirstVisitCompleted();
        navigate('/post-signup-welcome');
      }
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      setError('Apple sign-in failed. Please try again.');
    }
  };

  const handleAppleError = (error: any) => {
    console.error('Apple sign-in failed:', error);
    setError('Apple sign-in failed. Please try again.');
  };

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);

      // Get device ID first
      const deviceId = await getDeviceId();
      const loginResult = await authService.authenticateAsGuestUser(deviceId);

      // Check if login was successful
      if (loginResult.error) {
        throw new Error(loginResult.error.message || 'Failed to authenticate as guest user');
      }

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
          className="w-full space-y-4 flex flex-col items-center"
        >
          {/* Google Sign In Button */}
          <motion.div
            className="w-[90%]"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <div className="google-button-container" style={{ height: '48px' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          </motion.div>

          {/* Apple Sign In Button */}
          <motion.div
            className="w-[90%]"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <AppleSignin
              authOptions={{
                clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'your-apple-client-id',
                scope: 'name email',
                redirectURI: window.location.origin,
                state: 'login',
                nonce: 'scrummy-nonce',
                usePopup: true,
              }}
              uiType="dark"
              onSuccess={handleAppleSuccess}
              onError={handleAppleError}
              skipScript={false}
              render={(renderProps: any) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled || isLoading}
                  className="w-full bg-gray-900 dark:bg-gray-800 text-white flex items-center justify-center space-x-2 px-4 py-3 rounded-md shadow hover:bg-gray-800 dark:hover:bg-gray-700 font-medium border border-gray-900 dark:border-gray-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              )}
            />
          </motion.div>

          {/* Divider */}
          <div className="w-[90%] flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Create Account Button */}
          <MotionButton
            onClick={() => navigate('/signup')}
            className="w-[90%] bg-gradient-to-r from-primary-700 to-primary-600 via-primary-600 text-white px-4 py-3 rounded-md font-medium text-base shadow hover:from-primary-700 hover:to-primary-600 hover:via-primary-650 transition-colors border border-primary-600"
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Create Account
          </MotionButton>

          {/* Login Button */}
          <MotionButton
            onClick={() => navigate('/signin')}
            className="w-[90%] bg-gradient-to-r from-green-700 to-green-600 via-green-600 text-white px-4 py-3 rounded-md font-medium text-base shadow hover:from-green-700 hover:to-green-600 hover:via-green-650 transition-colors border border-green-600"
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            Login
          </MotionButton>

          {/* Continue without account */}
          <MotionButton
            onClick={handleGuestLogin}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline px-6 py-3 rounded-xl font-medium transition-colors flex justify-center items-center"
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            Continue without an account
          </MotionButton>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
