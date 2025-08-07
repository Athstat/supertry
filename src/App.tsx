import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './Routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AthleteProvider } from './contexts/AthleteContext';
import { PlayerProfileProvider } from './hooks/usePlayerProfile';
import { AppStateProvider } from './contexts/AppStateContext';
import ErrorBoundary, { FallbackProps } from './components/ErrorBoundary';
import AppErrorFallback from './components/AppErrorFallback';
import { useState } from 'react';
import ChatProvider from './contexts/ChatContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthTokenProvider from './components/auth/providers/AuthTokenProvider';

function App() {
  const [, setError] = useState<Error | null>(null);

  // Removed visibility change handler that was causing double reloads
  // Auth redirects are now handled by AuthContext and route guards

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}
    >
      <ThemeProvider>
        <AuthTokenProvider>
          <AuthProvider>
            <ChatProvider>
              <AthleteProvider>
                <PlayerProfileProvider>
                  <AppStateProvider>
                    <ErrorBoundary
                      onError={(err, errorInfo) => {
                        console.error('Root level error caught:', err, errorInfo);
                        setError(err);
                      }}
                      fallback={(props: FallbackProps) => <AppErrorFallback {...props} />}
                    >
                      <AppRoutes />
                    </ErrorBoundary>
                  </AppStateProvider>
                </PlayerProfileProvider>
              </AthleteProvider>
            </ChatProvider>
          </AuthProvider>

        </AuthTokenProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
