import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { logoutFromBridge, requestPushPermissionsAfterLogin } from '../utils/bridgeUtils';
import {
  DjangoAuthUser,
  DjangoDeviceAuthRes,
  DjangoLoginRes,
  DjangoRegisterRes,
  RegisterUserReq,
  RestPromise,
  ThrowableRes,
} from '../types/auth';
import { useBrudgeAuth } from '../hooks/useBridgeAuth';
import { analytics } from '../services/anayticsService';
import { logger } from '../services/logger';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<ThrowableRes<DjangoLoginRes>>;
  logout: () => void;
  loading: boolean;
  refreshSession: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  guestLogin: (deviceId: string) => RestPromise<DjangoDeviceAuthRes>;
  user?: DjangoAuthUser;
  register: (data: RegisterUserReq) => RestPromise<DjangoRegisterRes>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type declaration for scrummyAuthStatus injected by mobile app
declare global {
  interface Window {
    scrummyAuthStatus?: {
      isAuthenticated: boolean;
      tokens?: {
        accessToken: string;
        refreshToken: string;
      };
      userData?: {
        name?: string;
        email?: string;
        user_id?: string;
        external_id?: string;
      };
    };
    onScrummyAuthStatusReady?: (status: any) => void;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<DjangoAuthUser>();

  const { restoreAuthFromMobileApp, notifyBridgeOfLogin } = useBrudgeAuth(
    isAuthenticated,
    setIsAuthenticated
  );

  // Create a memoized function to check authentication status
  const checkAuth = useCallback(async () => {
    console.log('[AuthContext] Starting authentication check...');
    try {
      // First, try to restore authentication from mobile app
      console.log('[AuthContext] Attempting to restore auth from mobile app...');
      const restoredFromMobile = await restoreAuthFromMobileApp();

      if (restoredFromMobile) {
        console.log('[AuthContext] Successfully restored authentication from mobile app');
        setLoading(false);
        return true;
      }

      console.log('[AuthContext] Mobile app restoration failed, validating existing tokens...');
      // Validate authentication against Django server
      const authenticated = await authService.isAuthenticated();
      console.log('[AuthContext] Django server authentication result:', authenticated);
      setIsAuthenticated(authenticated);

      if (authenticated) {
        console.log('[AuthContext] User authenticated, fetching user data...');
        // Fetch fresh user data if authenticated
        try {
          const user = authService.getUserInfoSync();
          if (user) {
            console.log('[AuthContext] User data fetched successfully:', user.email);
            setUser(user);
          } else {
            console.warn('[AuthContext] Authentication successful but user data is null');
          }
        } catch (userError) {
          console.error('Failed to fetch user data after authentication:', userError);
          // Don't fail authentication just because user data fetch failed
        }
      } else {
        console.log('[AuthContext] User not authenticated, clearing user state');
        setUser(undefined);
      }

      console.log('[AuthContext] Authentication check completed, result:', authenticated);
      return authenticated;
    } catch (error) {
      console.error('[AuthContext] Authentication check failed with error:', error);
      setIsAuthenticated(false);
      setUser(undefined);
      return false;
    } finally {
      console.log('[AuthContext] Setting loading to false');
      setLoading(false);
    }
  }, [restoreAuthFromMobileApp]);

  // Initial authentication check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Add periodic token validation for long-running sessions
  // Note: Visibility change handling is now managed by AppStateContext
  useEffect(() => {
    // Add periodic token validation for long-running sessions
    const tokenValidationInterval = setInterval(
      () => {
        if (document.visibilityState === 'visible') {
          checkAuth();
        }
      },
      15 * 60 * 1000
    ); // Check every 15 minutes

    return () => {
      clearInterval(tokenValidationInterval);
    };
  }, [checkAuth]);

  // Function to refresh the session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    console.log('[AuthContext] Starting session refresh...');
    try {
      // Actually validate the session against the Django server
      const isValid = await authService.isAuthenticated();
      console.log('[AuthContext] Session refresh validation result:', isValid);

      setIsAuthenticated(isValid);

      if (isValid) {
        // Fetch fresh user data if session is valid
        try {
          const user = await authService.getUserInfo();
          if (user) {
            setUser(user);
            console.log('[AuthContext] Session refreshed successfully with user data');
          }
        } catch (userError) {
          console.error(
            '[AuthContext] Failed to fetch user data during session refresh:',
            userError
          );
          // Don't fail the refresh just because user data fetch failed
        }
      } else {
        console.log('[AuthContext] Session refresh failed, clearing user state');
        setUser(undefined);
      }

      return isValid;
    } catch (error) {
      console.error('[AuthContext] Session refresh failed with error:', error);
      setIsAuthenticated(false);
      setUser(undefined);
      return false;
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<ThrowableRes<DjangoLoginRes>> => {
    console.log('[AuthContext] Starting login process for user:', username);
    try {
      const { data: loginRes, message } = await authService.login(username, password);

      if (loginRes) {
        console.log('[AuthContext] Login successful, notifying bridge and updating state');
        await notifyBridgeOfLogin(loginRes.user);
        setUser(loginRes.user);
        setIsAuthenticated(true);
        console.log('[AuthContext] Login process completed successfully');
      } else {
        console.log('[AuthContext] Login failed, no login response data');
      }
      return { data: loginRes, message };
    } catch (error) {
      console.error('[AuthContext] Login failed with error:', error);
      setIsAuthenticated(false);

      return { message: 'Something went wrong, Please try again' };
    }
  };

  const guestLogin = async (deviceId: string): RestPromise<DjangoDeviceAuthRes> => {
    console.log('[AuthContext] Starting guest login for device:', deviceId);
    try {
      const { data: loginRes, error } = await authService.authenticateAsGuestUser(deviceId);

      if (loginRes) {
        console.log('[AuthContext] Guest login successful, notifying bridge and updating state');
        await notifyBridgeOfLogin(loginRes.user);
        setUser(loginRes.user);
        setIsAuthenticated(true);
        console.log('[AuthContext] Guest login process completed successfully');
      } else {
        console.log('[AuthContext] Guest login failed:', error);
      }

      return { data: loginRes, error };
    } catch (error) {
      console.error('[AuthContext] Guest login failed with error:', error);
      setIsAuthenticated(false);
      return { error: { message: 'Something went wrong trying to login as guest' } };
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Starting logout process...');
    try {
      // First, set authentication state to false to prevent components from accessing user data
      console.log('[AuthContext] Setting authentication state to false');
      setIsAuthenticated(false);

      // Clear the auth status from window object immediately to prevent re-authentication
      if (window.scrummyAuthStatus) {
        console.log('[AuthContext] Clearing window.scrummyAuthStatus');
        window.scrummyAuthStatus = {
          isAuthenticated: false,
          tokens: undefined,
          userData: undefined,
        };
      }

      // Clear auth data in the web app first
      console.log('[AuthContext] Clearing local auth data');
      authService.logout();

      // Clear OneSignal external ID in the mobile app (if running in WebView)
      // Wait for this to complete to ensure proper logout synchronization
      try {
        console.log('[AuthContext] Logging out from mobile app bridge...');
        const bridgeLogoutResult = await logoutFromBridge();
        console.log('[AuthContext] Bridge logout result:', bridgeLogoutResult);

        // Add a small delay to ensure the mobile app has processed the logout
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (bridgeError) {
        console.error('[AuthContext] Bridge logout error:', bridgeError);
        // Continue with logout even if bridge fails
      }

      // Don't navigate here - let the route guards handle it
      // This prevents double navigation/reload
      console.log('[AuthContext] Logout complete, route guards will handle navigation');
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const register = async (req: RegisterUserReq): RestPromise<DjangoRegisterRes> => {
    try {
      const { data, error } = await authService.registerUser(req);

      if (data) {
        analytics.trackUserSignUp('Email');
        requestPushPermissionsAfterLogin();
        notifyBridgeOfLogin(data.user);
        setIsAuthenticated(true);
      }

      return { data, error };
    } catch (err) {
      logger.error('Error registering user ', err);
      return {
        error: {
          message: 'Something went wrong, Please Try again',
        },
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading,
        refreshSession,
        checkAuth,
        resetPassword,
        guestLogin,
        user,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
