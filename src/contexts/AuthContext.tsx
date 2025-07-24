import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { logoutFromBridge, requestPushPermissionsAfterLogin } from '../utils/bridgeUtils';
import { DjangoAuthUser, DjangoDeviceAuthRes, DjangoLoginRes, DjangoRegisterRes, RegisterUserReq, RestPromise, ThrowableRes } from '../types/auth';
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
  user?: DjangoAuthUser,
  register: (data: RegisterUserReq) => RestPromise<DjangoRegisterRes>;
}

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
    isAuthenticated, setIsAuthenticated
  );

  // Create a memoized function to check authentication status
  const checkAuth = useCallback(async () => {
    try {
      // First, try to restore authentication from mobile app
      const restoredFromMobile = await restoreAuthFromMobileApp();

      if (restoredFromMobile) {
        setLoading(false);
        return true;
      }

      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      return authenticated;

    } catch (error) {

      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      return false;

    } finally {
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
    try {
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const login = async (username: string, password: string): Promise<ThrowableRes<DjangoLoginRes>> => {
    try {
      const { data: loginRes, message } = await authService.login(username, password);

      if (loginRes) {
        await notifyBridgeOfLogin(loginRes.user);
        setUser(loginRes.user)
        setIsAuthenticated(true);
      }
      return { data: loginRes, message };

    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);

      return { message: 'Something went wrong, Please try again' }
    }
  };

  const guestLogin = async (deviceId: string): RestPromise<DjangoDeviceAuthRes> => {

    try {

      const { data: loginRes, error } = await authService.authenticateAsGuestUser(deviceId);

      if (loginRes) {
        await notifyBridgeOfLogin(loginRes.user);
        setUser(loginRes.user)
        setIsAuthenticated(true);
      }

      return { data: loginRes, error };

    } catch (error) {

      console.error('Login failed:', error);
      setIsAuthenticated(false);
      return { error: { message: "Something went wrong trying to login as guest" } }

    }

  }

  const logout = async () => {
    try {

      // First, set authentication state to false to prevent components from accessing user data
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
        console.error('Bridge logout error:', bridgeError);
        // Continue with logout even if bridge fails
      }

      // Don't navigate here - let the route guards handle it
      // This prevents double navigation/reload
      console.log('[AuthContext] Logout complete, route guards will handle navigation');
    } catch (error) {
      console.error('Logout error:', error);
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

      return {data, error};

    } catch (err) {
      logger.error('Error registering user ', err);
      return {error: {
        message: 'Something went wrong, Please Try again'
      }}
    }
  }

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
        register
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
