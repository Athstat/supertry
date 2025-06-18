import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './Routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AthleteProvider } from './contexts/AthleteContext';
import { PlayerProfileProvider } from './hooks/usePlayerProfile';
import PageVisitsTracker from './components/analytics/PageVisitTracker';
import { AppStateProvider } from './contexts/AppStateContext';
import ErrorBoundary, { FallbackProps } from './components/ErrorBoundary';
import AppErrorFallback from './components/AppErrorFallback';
import { useState, useEffect } from 'react';
import { FirstVisitDebug } from './components/debug/FirstVisitDebug';

function useGlobalSwipeBack() {
  useEffect(() => {
    let startX: number | null = null;
    let startY: number | null = null;
    const threshold = 60; // px

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (startX === null || startY === null) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = Math.abs(endY - startY);

      if (dx > threshold && dy < 50) {
        // Left-to-right swipe detected
        window.history.back();
        console.log('swipe back');
      }
      startX = null;
      startY = null;
    }

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}

function App() {
  useGlobalSwipeBack();
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
                  console.error('Root level error caught:', err, errorInfo);
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
