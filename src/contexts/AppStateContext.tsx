import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAthletes } from './AthleteContext';
import { analytics } from '../services/anayticsService';
import { useLocation } from 'react-router-dom';
import {
  isAppStateValid,
  attemptStateRecovery,
  registerRecoveryListener,
} from '../utils/appStateUtils';

interface AppStateContextType {
  isActive: boolean;
  lastActiveTime: number | null;
  refreshAppState: () => Promise<void>;
  appStateStatus: 'idle' | 'refreshing' | 'error';
  forceRefresh: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Time threshold in milliseconds to consider the app as having been inactive for a long period
// 15 minutes = 15 * 60 * 1000 = 900000 milliseconds
const INACTIVITY_THRESHOLD = 15 * 60 * 1000;

// Health check interval in milliseconds
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState<boolean>(document.visibilityState === 'visible');
  const [lastActiveTime, setLastActiveTime] = useState<number | null>(Date.now());
  const [appStateStatus, setAppStateStatus] = useState<'idle' | 'refreshing' | 'error'>('idle');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // const { refreshSession } = useAuth();
  const { refreshAthletes } = useAthletes();
  const location = useLocation();

  // Keep track of recovery attempts to prevent infinite loops
  const recoveryAttemptsRef = useRef<number>(0);
  const lastRecoveryTimeRef = useRef<number>(0);

  // Force a refresh of the component tree
  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Function to refresh all critical app state
  const refreshAppState = useCallback(async () => {
    try {
      //console.log('AppStateManager: Refreshing app state...');
      setAppStateStatus('refreshing');

      // First refresh authentication session
      // const authRefreshed = await refreshSession();
      // console.log('AppStateManager: Auth session refresh result:', authRefreshed);

      // Then refresh data regardless of auth result
      // This ensures we at least try to get fresh data
      await refreshAthletes();

      // Track the current page to ensure analytics are working
      analytics.trackPageVisit(location.pathname);

      // Reset recovery attempts counter on successful refresh
      recoveryAttemptsRef.current = 0;

      setAppStateStatus('idle');
      //console.log('AppStateManager: App state refresh completed successfully');
    } catch (error) {
      //console.error('AppStateManager: Error refreshing app state:', error);
      setAppStateStatus('error');

      // Even if there's an error, we should still update the last active time
      // to prevent continuous refresh attempts
      setLastActiveTime(Date.now());

      // If we've had multiple failures, try a more aggressive recovery
      if (recoveryAttemptsRef.current >= 2) {
        console.log('AppStateManager: Multiple refresh failures, attempting state recovery');
        await attemptStateRecovery();
      }

      // Increment recovery attempts
      recoveryAttemptsRef.current += 1;
    }
  }, [refreshAthletes, location.pathname]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      const isNowVisible = document.visibilityState === 'visible';
      const currentTime = Date.now();
      const lastActive = lastActiveTime || 0;
      const inactiveDuration = currentTime - lastActive;

      //console.log(`AppStateManager: Visibility changed to ${isNowVisible ? 'visible' : 'hidden'}`);
      //console.log(`AppStateManager: Inactive duration: ${inactiveDuration}ms`);

      setIsActive(isNowVisible);

      if (isNowVisible) {
        // Update last active time
        setLastActiveTime(currentTime);

        // If the app has been inactive for a long time, refresh all state
        if (inactiveDuration > INACTIVITY_THRESHOLD) {
          console.log('AppStateManager: Long inactivity detected, performing full state refresh');
          await refreshAppState();
        } else {
          // Even for shorter inactivity periods, check if the app state is valid
          if (!isAppStateValid()) {
            console.log(
              'AppStateManager: Invalid app state detected after becoming visible, refreshing'
            );
            await refreshAppState();
          }
        }
      } else {
        // When becoming hidden, just update the last active time
        setLastActiveTime(currentTime);
      }
    };

    // Handle app refresh events from mobile app
    const handleAppRefresh = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('AppStateManager: Received app refresh event:', customEvent.detail);
      await refreshAppState();
    };

    // Register visibility change event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Register app refresh event listener
    window.addEventListener('appRefresh', handleAppRefresh);

    // Initial check
    handleVisibilityChange();

    // Periodic health check when the app is visible
    const healthCheckInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && appStateStatus !== 'refreshing') {
        // Perform a comprehensive check to ensure the app is still in a valid state
        try {
          if (!isAppStateValid()) {
            console.log('AppStateManager: Health check detected invalid state, refreshing...');
            refreshAppState();
          }
        } catch (error) {
          console.error('AppStateManager: Error during health check:', error);
        }
      }
    }, HEALTH_CHECK_INTERVAL);

    // Listen for recovery attempts
    const removeRecoveryListener = registerRecoveryListener(event => {
      const now = Date.now();
      // Prevent too frequent recovery attempts (at most once per minute)
      if (now - lastRecoveryTimeRef.current > 60000) {
        console.log('AppStateManager: Received recovery event, refreshing app state');
        lastRecoveryTimeRef.current = now;
        refreshAppState();
        forceRefresh();
      }
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('appRefresh', handleAppRefresh);
      clearInterval(healthCheckInterval);
      removeRecoveryListener();
    };
  }, [lastActiveTime, refreshAppState, appStateStatus, forceRefresh]);

  // This effect runs when refreshTrigger changes, forcing a re-render of children
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('AppStateManager: Forced refresh triggered');
    }
  }, [refreshTrigger]);

  return (
    <AppStateContext.Provider
      value={{
        isActive,
        lastActiveTime,
        refreshAppState,
        appStateStatus,
        forceRefresh,
      }}
    >
      {/* Key prop forces re-mount of children when refreshTrigger changes */}
      <div key={`app-state-${refreshTrigger}`} className="app-state-container">
        {children}
      </div>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}


/** Hook that provides a function to reload the entire page */
export function useAppReload() {
  
  const reloadWindow  = () => {
    if (window) {
      window.location.reload()
    }
  }
  
  return {
    reloadWindow
  }
}