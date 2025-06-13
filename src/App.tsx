import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AthleteProvider } from "./contexts/AthleteContext";
import { PlayerProfileProvider } from "./hooks/usePlayerProfile";
import PageVisitsTracker from "./components/analytics/PageVisitTracker";
import { AppStateProvider } from "./contexts/AppStateContext";
import ErrorBoundary, { FallbackProps } from "./components/ErrorBoundary";
import AppErrorFallback from "./components/AppErrorFallback";
import { useState } from "react";
import { FirstVisitDebug } from "./components/debug/FirstVisitDebug";

function App() {
  const [error, setError] = useState<Error | null>(null);
  const isDevelopment = import.meta.env.MODE === 'development';

  return (
    <ThemeProvider>
      <AuthProvider>
        <AthleteProvider>
          <PlayerProfileProvider>
            <AppStateProvider>
              <ErrorBoundary
                onError={(err, errorInfo) => {
                  console.error("Root level error caught:", err, errorInfo);
                  setError(err);
                }}
                fallback={(props: FallbackProps) => <AppErrorFallback {...props} />}
              >
                <PageVisitsTracker />
                <AppRoutes />
              </ErrorBoundary>
            </AppStateProvider>
          </PlayerProfileProvider>
        </AthleteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
