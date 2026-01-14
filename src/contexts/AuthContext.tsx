import { createContext, useContext, ReactNode, useCallback, Activity, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuthToken } from '../providers/AuthTokenProvider';
import useSWR, { KeyedMutator } from 'swr';
import { AuthStatus, DjangoAuthUser } from '../types/auth';
import ScrummyLoadingState from '../components/ui/ScrummyLoadingState';
import { analytics } from '../services/analytics/anayticsService';
import { CACHING_CONFIG } from '../types/constants';

type AuthContextType = {
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: DjangoAuthUser) => void;
  logout: () => void;
  authUser: DjangoAuthUser | undefined;
  isLoading: boolean;
  refreshAuthUser: KeyedMutator<DjangoAuthUser | undefined>;
  authStatus: AuthStatus
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

  const [status, setStatus] = useState<AuthStatus>('loading');

  const {
    accessToken, setAcessToken, saveUserInfoToLocalStorage,
    clearAccessTokenAndUser
  } = useAuthToken();

  const fetchKey = accessToken ? `/auth-user/${accessToken}` : null;

  const { data: authUser, isLoading, mutate } = useSWR(fetchKey, () => authService.whoami(accessToken), {
    dedupingInterval: CACHING_CONFIG.userProfileCachePeriod,
    revalidateOnFocus: false,
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

  useEffect(() => {
    if (!accessToken) {
      setStatus('unauthenticated');
      return;
    }

    if (isLoading) {
      setStatus('loading');
      return;
    }

    if (authUser) {
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, [accessToken, isLoading, authUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuth,
        logout,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        refreshAuthUser: mutate,
        authStatus: status
      }}
    >
      <Activity mode={status === 'loading' ? 'hidden' : 'visible'}>{children}</Activity>
      <Activity mode={status === 'loading' ? 'visible' : 'hidden'}>
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
