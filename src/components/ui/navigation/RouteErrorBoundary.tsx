import React from 'react';
import ErrorBoundary, { FallbackProps } from './ErrorBoundary';
import { useLocation } from 'react-router-dom';
import { useAppReload } from '../../../contexts/AppStateContext';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * A specialized error boundary for routes that provides route-specific error handling
 */
const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children }) => {
  const location = useLocation();
  const {reloadWindow} = useAppReload();

  const handleRouteError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`Route error at ${location.pathname}:`, error, errorInfo);
  };

  const RouteErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    const handleRetry = async () => {
      try {
        // Refresh app state before resetting the error boundary
        reloadWindow()
        resetErrorBoundary();
      } catch (refreshError) {
        console.error('Failed to refresh app state during route error recovery:', refreshError);
      }
    };

    return (
      <div className="p-6 max-w-lg mx-auto my-8 bg-white dark:bg-dark-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">
          Error loading this page
        </h2>
        
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary
      onError={handleRouteError}
      fallback={(props: FallbackProps) => <RouteErrorFallback {...props} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;
