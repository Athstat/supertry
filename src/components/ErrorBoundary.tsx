import React, { Component, ErrorInfo, ReactNode } from 'react';

// Define the FallbackProps type for the fallback render prop
export interface FallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

// Define the fallback types
type FallbackElement = ReactNode;
type FallbackRender = (props: FallbackProps) => ReactNode;

interface Props {
  children: ReactNode;
  fallback?: FallbackElement | FallbackRender;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  // Method to reset the error state
  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;
      
      // Prepare the props for the fallback
      const fallbackProps: FallbackProps = {
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary
      };
      
      // Render the fallback UI if provided
      if (fallback) {
        // Check if fallback is a function (render prop)
        if (typeof fallback === 'function') {
          return fallback(fallbackProps);
        }
        // Otherwise, it's a ReactNode
        return fallback;
      }
      
      // Default fallback UI
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.resetErrorBoundary}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
