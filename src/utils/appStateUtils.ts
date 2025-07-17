/**
 * Utility functions for managing and recovering application state
 */

/**
 * Check if the application state is valid
 * This performs various checks to determine if the app is in a healthy state
 */
export function isAppStateValid(): boolean {
  try {
    // Check if we have required DOM elements
    const rootElement = document.getElementById('root');
    if (!rootElement || rootElement.children.length === 0) {
      console.warn('AppStateUtils: Root element is empty or missing');
      return false;
    }

    // Check if we have authentication tokens when needed
    const hasAuthToken = localStorage.getItem('access_token') !== null;
    const hasRefreshToken = localStorage.getItem('refresh_token') !== null;

    // Check if React is still responsive by attempting to access React's internal properties
    // This is a heuristic and not foolproof
    const reactInternalProps = Object.keys(rootElement).some(key => 
      key.startsWith('__reactFiber$') || 
      key.startsWith('__reactProps$') || 
      key.startsWith('__reactContainer$')
    );
    
    if (!reactInternalProps) {
      console.warn('AppStateUtils: React internal properties not found, possible stale state');
      return false;
    }

    return true;
  } catch (error) {
    console.error('AppStateUtils: Error checking app state validity:', error);
    return false;
  }
}

/**
 * Attempt to recover the application state
 * This function tries various strategies to recover from a stale or invalid state
 */
export async function attemptStateRecovery(): Promise<boolean> {
  try {
    console.log('AppStateUtils: Attempting state recovery...');
    
    // First, try to clear any potential memory leaks or stale closures
    // by running garbage collection indirectly (this is just a hint to the browser)
    try {
      // Create and release a large object to encourage garbage collection
      let largeArray: number[] | undefined = new Array(10000000).fill(0);
      largeArray = undefined;
    } catch (memoryError) {
      console.warn('AppStateUtils: Memory cleanup attempt failed:', memoryError);
    }
    
    // Check if we need to refresh authentication
    const hasRefreshToken = localStorage.getItem('refresh_token') !== null;
    if (hasRefreshToken) {
      // We'll let the AuthContext handle the actual token refresh
      console.log('AppStateUtils: Refresh token exists, recovery possible via auth refresh');
    }
    
    // Force a re-render of the application by triggering a custom event
    // Components can listen for this event and update their state accordingly
    const recoveryEvent = new CustomEvent('app:state:recovery:attempt', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(recoveryEvent);
    
    console.log('AppStateUtils: Recovery attempt completed');
    return true;
  } catch (error) {
    console.error('AppStateUtils: Recovery attempt failed:', error);
    return false;
  }
}

/**
 * Register a listener for app state recovery attempts
 */
export function registerRecoveryListener(callback: (event: CustomEvent) => void): () => void {
  const typedCallback = (event: Event) => callback(event as CustomEvent);
  window.addEventListener('app:state:recovery:attempt', typedCallback);
  
  // Return a function to remove the listener
  return () => {
    window.removeEventListener('app:state:recovery:attempt', typedCallback);
  };
}
