import { createContext, useContext, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { useAuthToken } from '../providers/AuthTokenProvider';
import { Activity } from '../components/shared/Activity';
import useSWR, { KeyedMutator } from 'swr';
import { DjangoAuthUser } from '../types/auth';
import ScrummyLoadingState from '../components/ui/ScrummyLoadingState';
import { analytics } from '../services/analytics/anayticsService';
import { useDebounced } from '../hooks/useDebounced';
import { CACHING_CONFIG } from '../types/constants';

type AuthContextType = {
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: DjangoAuthUser) => void;
  logout: () => void;
  authUser: DjangoAuthUser | undefined;
  isLoading: boolean;
  refreshAuthUser: KeyedMutator<DjangoAuthUser | undefined>;
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
    onScrummyAuthStatusReady?: (status: string) => void;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, setAcessToken, saveUserInfoToLocalStorage, clearAccessTokenAndUser } =
    useAuthToken();

  const fetchKey = accessToken ? `/auth-user/${accessToken}` : null;

  const { data: authUser, isLoading, mutate } = useSWR(fetchKey, () => authService.whoami(accessToken), {
    dedupingInterval: CACHING_CONFIG.userProfileCachePeriod,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false
  });

  const setAuth = useCallback(
    (token: string, user: DjangoAuthUser) => {
      setAcessToken(token);
      saveUserInfoToLocalStorage(user);
    },
    [setAcessToken, saveUserInfoToLocalStorage]
  );

  const logout = useCallback(() => {
    clearAccessTokenAndUser();
    analytics.trackUserLogout();
  }, [clearAccessTokenAndUser]);

  const isLoadingDebounced = useDebounced(isLoading, 500);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuth,
        logout,
        isAuthenticated: authUser !== undefined,
        isLoading,
        refreshAuthUser: mutate,
      }}
    >
      <Activity mode={isLoadingDebounced ? 'hidden' : 'visible'}>{children}</Activity>

      <Activity mode={isLoadingDebounced ? 'visible' : 'hidden'}>
        <ScrummyLoadingState />
      </Activity>
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
