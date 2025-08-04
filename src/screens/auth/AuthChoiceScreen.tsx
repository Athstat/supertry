import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrummyLogo from '../../components/branding/scrummy_logo';
import { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { isFirstVisitCompleted, markFirstVisitCompleted } from '../../utils/firstVisitUtils';
import { getDeviceId } from '../../utils/deviceIdUtils';
import { useGoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

// Check if running in mobile WebView
const isMobileWebView = () => {
  return (
    (window.ScrummyBridge?.isMobileApp && window.ScrummyBridge.isMobileApp()) ||
    window.ReactNativeWebView !== undefined
  );
};

export function AuthChoiceScreen() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if running in mobile WebView
  const isMobileWebView = () => {
    return (
      (window.ScrummyBridge?.isMobileApp && window.ScrummyBridge.isMobileApp()) ||
      window.ReactNativeWebView !== undefined
    );
  };

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



  // Native Google Sign-In handler for mobile
  const handleGoogleSignIn = async () => {
    console.log('🔄 Google sign-in triggered, mobile WebView?', isMobileWebView());

    try {
      setIsLoading(true);
      setError(null);

      if (isMobileWebView() && window.ScrummyBridge?.googleSignIn) {
        console.log('📱 Using native Google Sign-In');
        // Use native bridge for mobile
        const result = await window.ScrummyBridge.googleSignIn();

        if (!result.success) {
          setError(result.error || 'Google sign-in failed');
          setIsLoading(false);
          return;
        }

        if (result.idToken) {
          // Send ID token to backend
          const authResult = await authService.googleOAuthWithIdToken(result.idToken);

          if (authResult.error) {
            setError(authResult.error.message || 'Google sign-in failed');
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
        } else {
          setError('No authentication token received');
          setIsLoading(false);
        }
      } else {
        // Regular web OAuth flow
        console.log('🌐 Using web OAuth flow');
        googleLogin();
      }
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-dark-850 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-6">
        <ScrummyLogo className="w-48 h-48" />
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Scrummy</h1>
        <p className="text-gray-400">
          You've officially joined the scrum! Don't worry, it's less bruises and more bragging
          rights from here.
        </p>
      </div>

      {/* Buttons Container */}
      <div className="w-full max-w-xs space-y-4">
        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white text-gray-900 flex items-center justify-center space-x-3 px-6 py-3 rounded-lg font-medium border border-gray-300"
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

        {/* Apple Button */}
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
              className="w-full bg-white text-gray-900 flex items-center justify-center space-x-3 px-6 py-3 rounded-lg font-medium border border-gray-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          )}
        />

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Create Account Button */}
        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create Account
        </button>

        {/* Login Button */}
        <button
          onClick={() => navigate('/signin')}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Login
        </button>

        {/* Continue without account - Only show in mobile app */}
        {isMobileWebView() && (
          <button
            onClick={handleGuestLogin}
            className="w-full text-gray-400 text-sm underline mt-4 py-2"
          >
            Continue without an account
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 text-red-400 text-sm text-center max-w-xs">
          {error}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-white">Signing you in...</p>
          </div>
        </div>
      )}
    </div>
  );
}
