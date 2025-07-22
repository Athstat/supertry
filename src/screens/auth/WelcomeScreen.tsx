import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import ScrummyLogo from '../../components/branding/scrummy_logo';
import { markFirstVisitCompleted } from '../../utils/firstVisitUtils';
import { getDeviceId } from '../../utils/deviceIdUtils';
import { CredentialResponse, useGoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
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
    console.log('Starting guest account creation...');
    setIsCreatingGuest(true);
    setError(null);

    try {
      // Get device ID first
      console.log('Getting device ID...');
      const deviceId = await getDeviceId();
      console.log('Device ID:', deviceId);

      // Create and login guest user
      console.log('Calling authService.authenticateAsGuestUser()...');
      const loginResult = await authService.authenticateAsGuestUser(deviceId);

      console.log('Guest user created and logged in successfully', loginResult);

      // Check if login was successful
      if (loginResult.error) {
        throw new Error(loginResult.error.message || 'Failed to authenticate as guest user');
      }

      // The authenticateAsGuestUser method already logs in the user and sets tokens
      // Now we need to update the auth context
      console.log('Updating auth state...');
      const authUpdated = await checkAuth();

      console.log('Auth check result:', authUpdated);

      // Store that this was the first visit completed
      markFirstVisitCompleted();

      // Navigate to post-signup-welcome
      if (authUpdated || localStorage.getItem('access_token')) {
        console.log('Navigating to post-signup welcome...');
        navigate('/post-signup-welcome');
      } else {
        throw new Error('Failed to authenticate after guest account creation');
      }
    } catch (err: any) {
      console.error('Error creating guest account:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError(err.message || 'Failed to get started. Please try again.');
      setIsCreatingGuest(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        setError(null);
        const result = await authService.googleOAuth(tokenResponse.code);

        if (result.error) {
          setError(result.error.message || 'Google sign-in failed');
          return;
        }

        // Update auth context
        await checkAuth();

        // Mark first visit completed and navigate
        markFirstVisitCompleted();
        navigate('/post-signup-welcome');
      } catch (err: any) {
        console.error('Google OAuth error:', err);
        setError('Google sign-in failed. Please try again.');
      }
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
    flow: 'auth-code',
  });

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

      // Mark first visit completed and navigate
      markFirstVisitCompleted();
      navigate('/post-signup-welcome');
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      setError('Apple sign-in failed. Please try again.');
    }
  };

  const handleAppleError = (error: any) => {
    console.error('Apple sign-in failed:', error);
    setError('Apple sign-in failed. Please try again.');
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
            You've officially joined the scrum! Don't worry, it's less bruises and more bragging
            rights from here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full mt-12 items-center justify-center flex flex-col space-y-4"
        >
          {/* Google Sign In Button */}
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300 },
            }}
            className="w-[90%] relative"
          >
            <button
              onClick={() => googleLogin()}
              disabled={isCreatingGuest}
              className="w-full bg-gray-900 dark:bg-gray-800 text-white flex items-center justify-center space-x-2 px-4 py-3 rounded-md shadow hover:bg-gray-800 dark:hover:bg-gray-700 font-medium border border-gray-900 dark:border-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </motion.div>

          {/* Apple Sign In Button */}
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300 },
            }}
            className="w-[90%]"
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
                  disabled={renderProps.disabled}
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
          <motion.button
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300 },
            }}
            onClick={() => navigate('/signup')}
            className="w-[90%] bg-primary-600 text-white px-4 py-3 rounded-md font-medium text-base flex items-center justify-center shadow"
          >
            <span>Create Account</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>

          {/* Login Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300 },
            }}
            onClick={() => navigate('/signin')}
            className="w-[90%] bg-green-600 text-white px-4 py-3 rounded-md font-medium text-base flex items-center justify-center shadow"
          >
            <span>Login</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>

          {/* Continue without account */}
          <motion.button
            whileHover={
              !isCreatingGuest
                ? {
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300 },
                  }
                : {}
            }
            onClick={handleGetStarted}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-75 disabled:cursor-not-allowed"
            {...(isCreatingGuest ? { disabled: true } : {})}
          >
            {isCreatingGuest ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin inline" />
                <span>Getting Started...</span>
              </>
            ) : (
              'Continue without an account'
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
        </motion.div>
      </motion.div>
    </div>
  );
}
