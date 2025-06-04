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
  if (!storedVersion || storedVersion !== CURRENT_APP_VERSION) {
    // Update stored version to current version
    localStorage.setItem(APP_VERSION_KEY, CURRENT_APP_VERSION);
    return true;
  }
  
  return false;
}

/**
 * Check if this is the user's first visit to the app
 * @returns {boolean} True if this is the first visit, false otherwise
 */
export function isFirstAppVisit(): boolean {
  // If it's a fresh install, always return true regardless of other flags
  if (isFreshInstall()) {
    // Reset other first visit flags to ensure fresh start
    localStorage.removeItem(FIRST_VISIT_KEY);
    localStorage.removeItem(FIRST_VISIT_COMPLETED_KEY);
    return true;
  }
  
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
export function getFirstVisitState(): { isFirstVisit: boolean, isFirstVisitCompleted: boolean, isFreshInstall: boolean } {
  return {
    isFirstVisit: isFirstAppVisit(),
    isFirstVisitCompleted: isFirstVisitCompleted(),
    isFreshInstall: isFreshInstall()
  };
} 