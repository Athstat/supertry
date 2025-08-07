import { createContext, useContext, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { useAuthToken } from '../components/auth/providers/AuthTokenProvider';
import useSWR from 'swr';
import { DjangoAuthUser } from '../types/auth';
import ScrummyLoadingState from '../components/ui/ScrummyLoadingState';
import { ErrorState } from '../components/ui/ErrorState';

type AuthContextType = {
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: DjangoAuthUser) => void,
  logout: () => void,
  authUser: DjangoAuthUser | undefined
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
  const {
    accessToken,
    setAcessToken,
    saveUserInfoToLocalStorage,
    clearAccessTokenAndUser
  } = useAuthToken();


  console.log("Now inside the auth provider here is the token we got", accessToken);

  const fetchKey = accessToken ? '/auth-user' : null;
  const {data: authUser, isLoading, error} = useSWR(fetchKey, () => authService.whoami(accessToken));

  const setAuth = useCallback((token: string, user: DjangoAuthUser) => {
    setAcessToken(token);
    saveUserInfoToLocalStorage(user);
  }, [setAcessToken, saveUserInfoToLocalStorage]);

  const logout = useCallback(() => {
    clearAccessTokenAndUser();
  }, [clearAccessTokenAndUser]);

  if (isLoading) {
    return (
      <ScrummyLoadingState />
    )
  }

  if (error) {
    return (
      <ErrorState error='Authentication Error' message={error} />
    )
  }

  console.log("Auth User here is the auth user ", authUser);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuth,
        logout,
        isAuthenticated: authUser !== undefined
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
