import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { logoutFromBridge, requestPushPermissionsAfterLogin } from '../utils/bridgeUtils';
import { DjangoAuthUser, DjangoDeviceAuthRes, DjangoLoginRes, DjangoRegisterRes, RegisterUserReq, RestPromise, ThrowableRes } from '../types/auth';
import { analytics } from '../services/anayticsService';
import { logger } from '../services/logger';
import { getAppStorage } from '../services/storage/appStorageFactory';
import { ACCESS_TOKEN_KEY } from '../services/auth/authTokenService';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<ThrowableRes<DjangoLoginRes>>;
  logout: () => void;
  loading: boolean;
  refreshSession: () => Promise<boolean>;
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

  // Initial authentication check

  const checkAuth = async () => {
    setLoading(true);

    const appStorage = getAppStorage();
    const authToken = await appStorage.getItem(ACCESS_TOKEN_KEY);

    if (authToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  // Function to refresh the session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    
    try {
      return true;
    } catch (error) {
      return false;
    }
    return true;
  }, []);

  const login = async (username: string, password: string): Promise<ThrowableRes<DjangoLoginRes>> => {
    try {
      const { data: loginRes, message } = await authService.login(username, password);

      if (loginRes) {
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
      await authService.logout();

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
        setIsAuthenticated(true);
      }

      return { data, error };

    } catch (err) {
      logger.error('Error registering user ', err);
      return {
        error: {
          message: 'Something went wrong, Please Try again'
        }
      }
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
