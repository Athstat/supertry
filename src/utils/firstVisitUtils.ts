/**
 * Utility functions for managing first visit tracking
 */

const FIRST_VISIT_KEY = 'has_visited_app';
const FIRST_VISIT_COMPLETED_KEY = 'first_visit_completed';
const APP_VERSION_KEY = 'app_version';

// Change this version number when you want to force a "fresh install" experience
const CURRENT_APP_VERSION = '1.0.0';

/**
 * Check if this is a fresh install by comparing stored version with current version
 * @returns {boolean} True if this is a fresh install or version has changed
 */
function isFreshInstall(): boolean {
  const storedVersion = localStorage.getItem(APP_VERSION_KEY);

  // If no version stored or version is different, consider it a fresh install
  return !storedVersion || storedVersion !== CURRENT_APP_VERSION;
}

/**
 * Check if this is the user's first visit to the app
 * @returns {boolean} True if this is the first visit, false otherwise
 */
export function isFirstAppVisit(): boolean {
  // Check if it's a fresh install first
  const freshInstall = isFreshInstall();

  // If it's a fresh install, always return true and reset flags
  if (freshInstall) {
    // Reset other first visit flags to ensure fresh start
    localStorage.removeItem(FIRST_VISIT_KEY);
    localStorage.removeItem(FIRST_VISIT_COMPLETED_KEY);
    // Update stored version to current version
    localStorage.setItem(APP_VERSION_KEY, CURRENT_APP_VERSION);
    return true;
  }

  // Otherwise, check the normal first visit flag
  return localStorage.getItem(FIRST_VISIT_KEY) !== 'true';
}

/**
 * Mark that the user has visited the app
 */
export function markAppVisited(): void {
  localStorage.setItem(FIRST_VISIT_KEY, 'true');
}

/**
 * Check if the user has completed the first visit flow
 * @returns {boolean} True if the first visit flow has been completed
 */
export function isFirstVisitCompleted(): boolean {
  return localStorage.getItem(FIRST_VISIT_COMPLETED_KEY) === 'true';
}

/**
 * Mark that the user has completed the first visit flow
 */
export function markFirstVisitCompleted(): void {
  localStorage.setItem(FIRST_VISIT_COMPLETED_KEY, 'true');
}

/**
 * Reset the first visit status
 * This is primarily for testing purposes or if a user wants to see the welcome flow again
 */
export function resetFirstVisitStatus(): void {
  localStorage.removeItem(FIRST_VISIT_KEY);
  localStorage.removeItem(FIRST_VISIT_COMPLETED_KEY);
}

/**
 * Simulate a fresh install by clearing all app data
 * This is useful for testing the first-time experience
 */
export function simulateFreshInstall(): void {
  localStorage.removeItem(FIRST_VISIT_KEY);
  localStorage.removeItem(FIRST_VISIT_COMPLETED_KEY);
  localStorage.removeItem(APP_VERSION_KEY);
}

/**
 * Get first visit state
 * @returns {Object} The current first visit state
 */
export function getFirstVisitState(): {
  isFirstVisit: boolean;
  isFirstVisitCompleted: boolean;
  isFreshInstall: boolean;
} {
  return {
    isFirstVisit: isFirstAppVisit(),
    isFirstVisitCompleted: isFirstVisitCompleted(),
    isFreshInstall: isFreshInstall(),
  };
}

/**
 * Debug function to log the current first visit state
 * This is helpful for testing and debugging the first visit flow
 */
export function debugFirstVisitState(): void {
  const state = getFirstVisitState();
  console.log('=== First Visit Debug State ===');
  console.log('isFirstVisit:', state.isFirstVisit);
  console.log('isFirstVisitCompleted:', state.isFirstVisitCompleted);
  console.log('isFreshInstall:', state.isFreshInstall);
  console.log('localStorage values:');
  console.log('  has_visited_app:', localStorage.getItem(FIRST_VISIT_KEY));
  console.log('  first_visit_completed:', localStorage.getItem(FIRST_VISIT_COMPLETED_KEY));
  console.log('  app_version:', localStorage.getItem(APP_VERSION_KEY));
  console.log('  current_app_version:', CURRENT_APP_VERSION);
  console.log('==============================');
}

// Make debug function available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugFirstVisit = debugFirstVisitState;
  (window as any).simulateFreshInstall = simulateFreshInstall;
  (window as any).resetFirstVisitStatus = resetFirstVisitStatus;
}
