import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './Routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AthleteProvider } from './contexts/AthleteContext';
import { PlayerProfileProvider } from './hooks/usePlayerProfile';
import { AppStateProvider } from './contexts/AppStateContext';
import ErrorBoundary, { FallbackProps } from './components/ErrorBoundary';
import AppErrorFallback from './components/AppErrorFallback';
import { useEffect, useState } from 'react';
import ChatProvider from './contexts/ChatContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthTokenProvider from './providers/AuthTokenProvider';
import NetworkStatusProvider from './components/network/NetworkStatusProvider';
import SportActionsDefinitionsProvider from './components/stats/SportActionsDefinitionsProvider';
import { useSyncDeviceId } from './hooks/auth/useSyncDeviceId';
import NavigationBarsProvider from './providers/navigation/NavigationBarsProvider';
import BrowserHistoryProvider from './providers/web/BrowserHistoryProvider';
import { twMerge } from 'tailwind-merge';
import { AppColours } from './types/constants';

function DeviceIdSync() {
  useSyncDeviceId();
  return null;
}

function App() {
  const [, setError] = useState<Error | null>(null);

  // Fixes white overflow when pulling the screen up from the top
  useEffect(() => {
    document.body.className = twMerge(
      AppColours.BACKGROUND,
      "w-screen h-screen"
    );
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}
    >
      <ThemeProvider>
        <NetworkStatusProvider>
          <AuthTokenProvider>
            <AuthProvider>
              <DeviceIdSync />
              <ChatProvider>
                <AthleteProvider>
                  <SportActionsDefinitionsProvider>
                    <PlayerProfileProvider>
                      <AppStateProvider>
                        <ErrorBoundary
                          onError={(err, errorInfo) => {
                            console.error('Root level error caught:', err, errorInfo);
                            setError(err);
                          }}
                          fallback={(props: FallbackProps) => <AppErrorFallback {...props} />}
                        >
                          <BrowserHistoryProvider>
                            <NavigationBarsProvider>
                              <AppRoutes />
                            </NavigationBarsProvider>
                          </BrowserHistoryProvider>
                        </ErrorBoundary>
                      </AppStateProvider>
                    </PlayerProfileProvider>
                  </SportActionsDefinitionsProvider>
                </AthleteProvider>
              </ChatProvider>
            </AuthProvider>
          </AuthTokenProvider>
        </NetworkStatusProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
