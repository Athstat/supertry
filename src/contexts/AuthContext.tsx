import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import {
  requestPushPermissionsAfterLogin,
  logoutFromBridge,
  loginWithBridge,
} from '../utils/bridgeUtils';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
  refreshSession: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
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

  // Function to restore authentication from mobile app's scrummyAuthStatus
  const restoreAuthFromMobileApp = useCallback(async () => {
    try {
      // Check if we have authentication status from the mobile app
      if (window.scrummyAuthStatus && window.scrummyAuthStatus.isAuthenticated) {
        console.log(
          'AuthContext: Found authentication status from mobile app:',
          window.scrummyAuthStatus
        );

        const { tokens, userData } = window.scrummyAuthStatus;

        if (tokens && tokens.accessToken && tokens.refreshToken) {
          // Store the tokens in the web app's localStorage
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);

          // Store user data if available
          if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
          }

          console.log('AuthContext: Successfully restored authentication from mobile app');
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('AuthContext: Error restoring auth from mobile app:', error);
      return false;
    }
  }, []);

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

      // If not authenticated but we have a refresh token, try to refresh
      if (!authenticated && localStorage.getItem('refresh_token')) {
        const refreshed = await authService.refreshToken();
        setIsAuthenticated(refreshed);
        return refreshed;
      }

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

  // Listen for authentication status updates from mobile app
  useEffect(() => {
    // Set up the listener for when mobile app provides auth status
    window.onScrummyAuthStatusReady = async status => {
      console.log('AuthContext: Received auth status from mobile app:', status);

      if (status && status.isAuthenticated) {
        const { tokens, userData } = status;

        if (tokens && tokens.accessToken && tokens.refreshToken) {
          // Store the tokens in the web app's localStorage
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);

          // Store user data if available
          if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
          }

          console.log(
            'AuthContext: Successfully restored authentication from mobile app via callback'
          );
          setIsAuthenticated(true);
        }
      } else {
        console.log('AuthContext: Mobile app indicates user is not authenticated');
        setIsAuthenticated(false);
      }
    };

    // Cleanup function
    return () => {
      window.onScrummyAuthStatusReady = undefined;
    };
  }, []);

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
      console.log('AuthContext: Attempting to refresh session');
      const refreshed = await authService.refreshToken();
      console.log('AuthContext: Session refresh result:', refreshed);
      setIsAuthenticated(refreshed);
      return refreshed;
    } catch (error) {
      console.error('AuthContext: Session refresh failed:', error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await authService.login(username, password);
      setIsAuthenticated(true);

      // Notify the mobile app bridge about successful login
      try {
        const userInfo = authService.getUserInfo();
        if (userInfo) {
          const tokens = {
            accessToken: localStorage.getItem('access_token') || '',
            refreshToken: localStorage.getItem('refresh_token') || '',
          };
          const userData = {
            name:
              `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() ||
              userInfo.username ||
              '',
            email: userInfo.email || '',
            user_id: userInfo.id || '',
            onesignal_id: localStorage.getItem('onesignal_id') || undefined,
          };

          console.log('AuthContext: Notifying mobile app bridge about login...');
          const bridgeResult = await loginWithBridge(tokens, userData);
          console.log('AuthContext: Mobile app bridge login result:', bridgeResult);
        }
      } catch (bridgeError) {
        console.error('AuthContext: Error notifying mobile app bridge:', bridgeError);
        // Don't fail the login if bridge communication fails
      }

      // Request push permissions after successful login (non-blocking)
      requestPushPermissionsAfterLogin();

      return result;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // First, set authentication state to false to prevent components from accessing user data
      setIsAuthenticated(false);

      // Clear OneSignal external ID in the mobile app (if running in WebView)
      // This is non-blocking to prevent UI issues
      logoutFromBridge().catch(error => {
        console.error('Bridge logout error:', error);
      });

      // Finally, clear auth data in the web app
      authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
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
