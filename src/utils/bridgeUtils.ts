/**
 * ScrummyBridge utility functions
 * Provides helper functions for working with the ScrummyBridge
 */
import { BridgeUserData } from '../types/auth';
import { authService } from '../services/authService';

// Type declaration for the ScrummyBridge
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(message: string): void;
    };
    ScrummyBridge?: {
      requestPushPermission(userData?: any): Promise<{
        granted: boolean;
        onesignal_id?: string;
      }>;
      login(
        tokens: { accessToken: string; refreshToken: string },
        userData: BridgeUserData
      ): Promise<{ success: boolean }>;
      logout(): Promise<{ success: boolean }>;
      getAuthStatus(): Promise<{
        isAuthenticated: boolean;
        userData?: {
          name?: string;
          email?: string;
          user_id?: string;
          onesignal_id?: string;
        };
      }>;
      getDeviceId(): Promise<string>;
      initializeAuth(): Promise<{
        isAuthenticated: boolean;
        tokens?: {
          accessToken: string;
          refreshToken: string;
        };
        userData?: {
          name?: string;
          email?: string;
          user_id?: string;
          external_id?: string;
        };
      }>;
    };
    // Also support lowercase version (as injected by mobile app)
    scrummyBridge?: {
      requestPushPermission(userData?: any): Promise<{
        granted: boolean;
        onesignal_id?: string;
      }>;
      login(
        tokens: { accessToken: string; refreshToken: string },
        userData: BridgeUserData
      ): Promise<{ success: boolean }>;
      logout(): Promise<{ success: boolean }>;
      getAuthStatus(): Promise<{
        isAuthenticated: boolean;
        userData?: {
          name?: string;
          email?: string;
          user_id?: string;
          onesignal_id?: string;
        };
      }>;
      getDeviceId(): Promise<string>;
      initializeAuth(): Promise<{
        isAuthenticated: boolean;
        tokens?: {
          accessToken: string;
          refreshToken: string;
        };
        userData?: {
          name?: string;
          email?: string;
          user_id?: string;
          external_id?: string;
        };
      }>;
    };
  }
}

/**
 * Check if the ScrummyBridge is available
 */
export function isBridgeAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window.ScrummyBridge || window.scrummyBridge);
}

/**
 * Request push notification permission
 * @param userId The user ID to associate with push notifications
 * @param email Optional user email to associate with push notifications
 */
export async function requestPushPermission(
  userId: string,
  email?: string
): Promise<{
  granted: boolean;
  onesignal_id?: string;
}> {
  if (!isBridgeAvailable()) {
    console.error('ScrummyBridge not available');
    return { granted: false };
  }

  try {
    // Create user data object to send to the native app
    const userData = {
      user_id: userId,
      email: email,
    };

    // Request push permission with user data
    const bridge = getBridge();
    const result = await bridge!.requestPushPermission(userData);

    if (result.granted && result.onesignal_id) {
      console.log('Push notifications enabled, OneSignal ID:', result.onesignal_id);

      // Store OneSignal ID in localStorage for future reference
      localStorage.setItem('onesignal_id', result.onesignal_id);
      return result;
    } else {
      console.log('Push notifications not enabled');
      return { granted: false };
    }
  } catch (error) {
    console.error('Error requesting push permissions:', error);
    return { granted: false };
  }
}

/**
 * Get the available bridge object (either uppercase or lowercase)
 */
function getBridge() {
  return window.ScrummyBridge || window.scrummyBridge;
}

/**
 * Send login data to the native app
 */
export async function loginWithBridge(
  tokens: { accessToken: string; refreshToken: string },
  userData: BridgeUserData
): Promise<boolean> {
  if (!isBridgeAvailable()) {
    return false;
  }

  try {
    const bridge = getBridge();
    const result = await bridge!.login(tokens, userData);
    return result.success;
  } catch (error) {
    console.error('Error logging in with bridge:', error);
    return false;
  }
}

/**
 * Log out from the native app
 */
export async function logoutFromBridge(): Promise<boolean> {
  if (!isBridgeAvailable()) {
    return false;
  }

  try {
    const bridge = getBridge();
    const result = await bridge!.logout();
    return result.success;
  } catch (error) {
    console.error('Error logging out from bridge:', error);
    return false;
  }
}

/**
 * Get current authentication status from the native app
 */
export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean;
  userData?: {
    name?: string;
    email?: string;
    user_id?: string;
    onesignal_id?: string;
  };
}> {
  if (!isBridgeAvailable()) {
    return { isAuthenticated: false };
  }

  try {
    const bridge = getBridge();
    return await bridge!.getAuthStatus();
  } catch (error) {
    console.error('Error getting auth status:', error);
    return { isAuthenticated: false };
  }
}

/**
 * Listen for messages from the bridge
 * @returns A cleanup function to remove the event listener
 */
export function listenForBridgeMessages(callback: (message: any) => void): () => void {
  if (typeof window === 'undefined') {
    // Return a no-op cleanup function
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      callback(message);
    } catch (error) {
      // Ignore non-JSON messages
    }
  };

  window.addEventListener('message', handler);

  // Return a cleanup function
  return () => {
    window.removeEventListener('message', handler);
  };
}

/**
 * Create a bridge user data object, ensuring all fields have the correct types
 * @param name User's full name
 * @param email User's email address
 * @param userId User's unique identifier
 * @param oneSignalId Optional OneSignal player ID
 * @returns A properly formatted BridgeUserData object
 */
export function createBridgeUserData(
  name: string,
  email: string,
  userId: string,
  oneSignalId?: string | null
): BridgeUserData {
  // Create the base userData object
  const userData: BridgeUserData = {
    name,
    email,
    user_id: userId || 'unknown', // Ensure we have a non-empty string
  };

  // Only add the onesignal_id property if it's a non-null, non-empty string
  if (oneSignalId && oneSignalId.trim() !== '') {
    userData.onesignal_id = oneSignalId;
  }

  return userData;
}

/**
 * Simple function to request push notification permissions
 *
 * This simplified implementation follows best practices:
 * 1. Check for existing OneSignal ID in localStorage first
 * 2. Get user info securely from the auth service
 * 3. Pass both userId and email to OneSignal
 * 4. Store the OneSignal ID for future reference
 * 5. Provide robust error handling
 */
export async function requestPushPermissions(): Promise<boolean> {
  try {
    // Check if we already have a OneSignal ID
    const existingOneSignalId = localStorage.getItem('onesignal_id');
    if (existingOneSignalId) {
      console.log('Already have OneSignal ID:', existingOneSignalId);
      return true; // Already have permissions
    }

    // Get current user info
    const userInfo = authService.getUserInfo();
    if (!userInfo || !userInfo.id) {
      console.error('User info not available');
      return false;
    }

    // Request push permissions with user ID and email
    console.log(`Requesting push permissions for user ${userInfo.id}`);
    const result = await requestPushPermission(userInfo.id, userInfo.email);

    if (result.granted) {
      console.log(`Push permissions granted with OneSignal ID: ${result.onesignal_id}`);
      return true;
    } else {
      console.log('Push permissions not granted');
      return false;
    }
  } catch (error) {
    console.error('Error requesting push permissions:', error);
    return false;
  }
}

/**
 * Request push permissions with explicit user data (for signup scenarios)
 * @param userId The user's Keycloak ID
 * @param email The user's email address
 */
export async function requestPushPermissionsWithUserData(
  userId: string,
  email: string
): Promise<boolean> {
  try {
    // Check if we already have a OneSignal ID
    const existingOneSignalId = localStorage.getItem('onesignal_id');
    if (existingOneSignalId) {
      console.log('Already have OneSignal ID:', existingOneSignalId);
      return true; // Already have permissions
    }

    // Request push permissions with explicit user data
    console.log(`Requesting push permissions for user ${userId}`);
    const result = await requestPushPermission(userId, email);

    if (result.granted) {
      console.log(`Push permissions granted with OneSignal ID: ${result.onesignal_id}`);
      return true;
    } else {
      console.log('Push permissions not granted');
      return false;
    }
  } catch (error) {
    console.error('Error requesting push permissions:', error);
    return false;
  }
}

/**
 * Request push permissions after login (non-blocking)
 * This function runs in the background and doesn't block the UI
 */
export function requestPushPermissionsAfterLogin(): void {
  // Only run if bridge is available (in mobile app)
  if (!isBridgeAvailable()) {
    return;
  }

  // Run asynchronously without blocking
  setTimeout(async () => {
    try {
      const success = await requestPushPermissions();
      if (success) {
        console.log('Push permissions setup completed after login');
      }
    } catch (error) {
      console.error('Error setting up push permissions after login:', error);
    }
  }, 1000); // Wait 1 second after login to request permissions
}

/**
 * Request push permissions after signup with explicit user data (non-blocking)
 * This function works even when the user isn't authenticated yet
 * @param userId The user's Keycloak ID
 * @param email The user's email address
 */
export function requestPushPermissionsAfterSignup(userId: string, email: string): void {
  // Only run if bridge is available (in mobile app)
  if (!isBridgeAvailable()) {
    return;
  }

  // Run asynchronously without blocking
  setTimeout(async () => {
    try {
      const success = await requestPushPermissionsWithUserData(userId, email);
      if (success) {
        console.log('Push permissions setup completed after signup');
      }
    } catch (error) {
      console.error('Error setting up push permissions after signup:', error);
    }
  }, 1000); // Wait 1 second after signup to request permissions
}

/**
 * Request navigation in the mobile app WebView
 * @param url The URL to navigate to
 */
export function requestNavigation(url: string): void {
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'NAVIGATE',
        payload: { url },
      })
    );
  }
}
