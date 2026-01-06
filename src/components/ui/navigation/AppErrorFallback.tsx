import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { attemptStateRecovery } from '../utils/appStateUtils';
import { FallbackProps } from './ErrorBoundary';

/**
 * A fallback UI component that is displayed when the app encounters an error.
 * It provides options to refresh the app state or reload the page.
 */
const AppErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const { refreshAppState, forceRefresh } = useAppState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // First try to refresh the app state
      await refreshAppState();
      
      // Force a refresh of the component tree
      forceRefresh();
      
      // Then reset the error boundary
      resetErrorBoundary();
      
      setIsRefreshing(false);
    } catch (refreshError) {
      console.error('Failed to refresh app state:', refreshError);
      setIsRefreshing(false);
      
      // If we haven't tried recovery yet, attempt it
      if (!recoveryAttempted) {
        setRecoveryAttempted(true);
        try {
          await attemptStateRecovery();
          // After recovery, try refreshing again
          await refreshAppState();
          forceRefresh();
          resetErrorBoundary();
        } catch (recoveryError) {
          console.error('Recovery attempt failed:', recoveryError);
        }
      } else {
        // If recovery was already attempted, suggest a full page reload
        window.location.reload();
      }
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-dark-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something went wrong
        </h2>
        
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {error?.message || 'An unexpected error occurred in the application.'}
          </p>
        </div>
        
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. You can try to recover by refreshing the app state or reloading the page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              isRefreshing 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh App State'}
          </button>
          
          <button
            onClick={handleReload}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppErrorFallback;
