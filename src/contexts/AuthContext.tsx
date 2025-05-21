import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { authService } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Create a memoized function to check authentication status
  const checkAuth = useCallback(async () => {
    try {
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
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Add periodic token validation for long-running sessions
  // Note: Visibility change handling is now managed by AppStateContext
  useEffect(() => {
    // Add periodic token validation for long-running sessions
    const tokenValidationInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => {
      clearInterval(tokenValidationInterval);
    };
  }, [checkAuth]);

  // Function to refresh the session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("AuthContext: Attempting to refresh session");
      const refreshed = await authService.refreshToken();
      console.log("AuthContext: Session refresh result:", refreshed);
      setIsAuthenticated(refreshed);
      return refreshed;
    } catch (error) {
      console.error("AuthContext: Session refresh failed:", error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await authService.login(username, password);
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    try {
      authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      loading,
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
