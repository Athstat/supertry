import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthLayout } from '../../components/auth/AuthLayout';
import EmailPasswordLoginBox from '../../components/auth/login/EmailPasswordLoginBox';
import GuestLoginBox from '../../components/auth/login/GuestLoginBox';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { isFirstVisitCompleted, markFirstVisitCompleted } from '../../utils/firstVisitUtils';
import { useGoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';
import Experimental from '../../components/shared/ab_testing/Experimental';

// Button animation variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.01,
    transition: { type: 'linear', stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.98 },
};

// Check if running in mobile WebView
const isMobileWebView = () => {
  return (
    (window.ScrummyBridge?.isMobileApp && window.ScrummyBridge.isMobileApp()) ||
    window.ReactNativeWebView !== undefined
  );
};

export function SignInScreen() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        setIsLoading(true);
        setError(null);
        // For the code flow, we need to exchange the code for a token on the backend
        // But since our backend expects an ID token, we'll use the authorization code
        const result = await authService.googleOAuth(tokenResponse.code);

        if (result.error) {
          setError(result.error.message || 'Google sign-in failed');
          setIsLoading(false);
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
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    },
    flow: 'auth-code',
  });

  const handleAppleSuccess = async (response: any) => {
    if (!response.authorization || !response.authorization.id_token) {
      setError('Apple sign-in failed. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await authService.appleOAuth(response.authorization.id_token);

      if (result.error) {
        setError(result.error.message || 'Apple sign-in failed');
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const handleAppleError = (error: any) => {
    console.error('Apple sign-in failed:', error);
    setError('Apple sign-in failed. Please try again.');
  };

  return (
    <>
      {/* Full-screen loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gray-50 dark:bg-dark-850 z-50 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Signing you in...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we sign you in...</p>
          </motion.div>
        </motion.div>
      )}

      <AuthLayout title="Welcome back" subtitle="Sign in to your account">
        <div className="mt-8 space-y-6">
          {/* Google Sign In Button */}

          <Experimental>
            <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
              <button
                onClick={() => googleLogin()}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center space-x-2 px-4 py-3 rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium border border-gray-300 dark:border-gray-600 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
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
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center space-x-2 px-4 py-3 rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium border border-gray-300 dark:border-gray-600 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                )}
              />
            </motion.div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
              <div className="text-sm px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-850">
                or
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
            </div>

          </Experimental>

          <EmailPasswordLoginBox />

          {isMobileWebView() && <GuestLoginBox />}

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

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
