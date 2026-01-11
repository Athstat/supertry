/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Device ID utilities for both mobile app (via WebView) and web browser
 */

import { DjangoAuthUser } from '../../types/auth';
import { DeviceIdPair } from '../../types/device';
import { getMobileDeviceId } from './mobileDeviceIdUtils';
import { getWebDeviceId } from './webDeviceIdUtils';

/**
 * Error thrown when a device ID cannot be obtained on mobile.
 */

/**
 * Internal: get the injected bridge if available (supports both cases)
 */
function getBridge(): any | undefined {
  // Lowercase scrummyBridge is injected by our app, but also support uppercase for safety
  const w = window as any;
  return w.scrummyBridge || w.ScrummyBridge;
}

/**
 * Check if the current environment is a mobile app WebView
 * - Prefer ReactNativeWebView flag or presence of bridge
 * @returns boolean
 */
export function isMobileApp(): boolean {
  const w = window as any;
  return typeof window !== 'undefined' && (!!w.ReactNativeWebView || !!getBridge());
}

/**
 * Get the device ID - either from mobile app (strict) or generate/retrieve for web
 * @returns Promise<string> The device ID
 */
export async function getDeviceId(): Promise<DeviceIdPair> {
  if (isMobileApp()) {
    return getMobileDeviceId();
  }

  return getWebDeviceId();
}

/**
 * Format a device ID to ensure it's acceptable to the backend (web-path usage)
 * @param id The raw device ID
 * @returns string A formatted device ID that should pass validation
 */
export function formatDeviceId(id: string): string {
  if (!id) return 'fallback_' + Date.now();

  // Remove any characters that aren't alphanumeric, dash, or underscore
  let formatted = id.replace(/[^a-zA-Z0-9\-_]/g, '');

  // Ensure it starts with a letter or number
  if (!/^[a-zA-Z0-9]/.test(formatted)) {
    formatted = 'id_' + formatted;
  }

  // Limit length to avoid issues
  formatted = formatted.substring(0, 64);

  return formatted;
}

/**
 * Generate a guest username
 * @returns string A unique guest username
 */
export function generateGuestUsername(): string {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `Guest_${randomChars}`;
}

/**
 * Check if an email is a guest account email
 * @param email The email to check
 * @returns boolean
 */
export function isGuestEmail(email: string): boolean {
  return email.endsWith('@devices.scrummy-app.ai');
}

/** Returns true is a user's account is a guest account */
export function isGuestUser(user: DjangoAuthUser | undefined) {
  if (!user) return false;
  return user.is_claimed_account !== true;
}

/**
 * Extract device ID from guest email
 * @param email The guest email
 * @returns string|null The device ID or null if not a guest email
 */
export function getDeviceIdFromEmail(email: string): string | null {
  if (!isGuestEmail(email)) {
    return null;
  }
  return email.replace('@devices.scrummy-app.ai', '');
}
