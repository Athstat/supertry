/**
 * Device ID utilities for both mobile app (via WebView) and web browser
 */

import { DjangoAuthUser } from '../types/auth';

/**
 * Error thrown when a device ID cannot be obtained on mobile.
 */
export class DeviceIdUnavailableError extends Error {
  constructor(message = 'Unable to obtain mobile device ID') {
    super(message);
    this.name = 'DeviceIdUnavailableError';
  }
}

/**
 * Internal: get the injected bridge if available (supports both cases)
 */
function getBridge(): any | undefined {
  // Lowercase scrummyBridge is injected by our app, but also support uppercase for safety
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.scrummyBridge || w.ScrummyBridge;
}

/**
 * Check if the current environment is a mobile app WebView
 * - Prefer ReactNativeWebView flag or presence of bridge
 * @returns boolean
 */
export function isMobileApp(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return typeof window !== 'undefined' && (!!w.ReactNativeWebView || !!getBridge());
}

/**
 * Wait for the mobile bridge to be ready or time out
 * Listens for ScrummyBridgeReady event and polls for getBridge()
 */
async function waitForBridgeOrTimeout(timeoutMs = 10000): Promise<void> {
  if (getBridge()) return;

  await new Promise<void>((resolve, reject) => {
    let done = false;
    const finish = (ok: boolean, err?: Error) => {
      if (done) return;
      done = true;
      clearTimeout(timeoutId);
      document.removeEventListener('ScrummyBridgeReady', onReady);
      if (ok) resolve();
      else reject(err);
    };

    const onReady = () => {
      if (getBridge()) {
        finish(true);
      }
    };

    // Poll every 100ms
    const poll = () => {
      if (getBridge()) {
        finish(true);
      } else if (!done) {
        setTimeout(poll, 100);
      }
    };

    document.addEventListener('ScrummyBridgeReady', onReady, { once: true });
    const timeoutId = setTimeout(() => {
      finish(false, new DeviceIdUnavailableError('Bridge not ready before timeout'));
    }, timeoutMs);

    // Start polling
    poll();
  });
}

/**
 * Strict normalization/validation for mobile device IDs
 * - Only allow [a-zA-Z0-9-_]
 * - Max length 64
 * - Must start with alphanumeric and be at least 8 chars
 */
function normalizeDeviceIdStrict(id: string): string {
  if (!id) {
    throw new DeviceIdUnavailableError('Received empty device ID');
  }

  const trimmed = String(id).trim();
  if (!trimmed) {
    throw new DeviceIdUnavailableError('Received blank device ID');
  }

  let formatted = trimmed.replace(/[^a-zA-Z0-9\-_]/g, '');

  if (!/^[a-zA-Z0-9]/.test(formatted)) {
    throw new DeviceIdUnavailableError('Device ID must start with alphanumeric');
  }

  formatted = formatted.substring(0, 64);

  if (formatted.length < 8) {
    throw new DeviceIdUnavailableError('Device ID too short after sanitization');
  }

  return formatted;
}

/**
 * Get the device ID from the native bridge with strict requirements.
 * Throws DeviceIdUnavailableError on any failure. Never generates a UUID here.
 */
async function getMobileDeviceIdStrict(): Promise<string> {
  console.log('[getDeviceId] Mobile environment detected; resolving device ID via bridge');

  await waitForBridgeOrTimeout(10000);

  const bridge = getBridge();

  if (!bridge || typeof bridge.getDeviceId !== 'function') {
    throw new DeviceIdUnavailableError('Bridge.getDeviceId not available');
  }

  try {
    const deviceIdPromise: Promise<string> = Promise.resolve(bridge.getDeviceId());
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => {
        reject(new DeviceIdUnavailableError('Device ID request timeout after 5 seconds'));
      }, 5000);
    });

    const rawId = await Promise.race([deviceIdPromise, timeoutPromise]);
    const normalized = normalizeDeviceIdStrict(rawId);
    console.log('[getDeviceId] Obtained device ID from bridge', normalized);
    return normalized;
  } catch (err) {
    if (err instanceof DeviceIdUnavailableError) {
      throw err;
    }
    console.error('[getDeviceId] Error retrieving device ID from bridge:', err);
    throw new DeviceIdUnavailableError('Bridge getDeviceId failed');
  }
}

/**
 * Get the device ID - either from mobile app (strict) or generate/retrieve for web
 * @returns Promise<string> The device ID
 */
export async function getDeviceId(): Promise<string> {
  // Mobile: must return native device ID or throw. No UUID fallback.
  if (isMobileApp()) {
    return getMobileDeviceIdStrict();
  }

  // Web browser: use localStorage (unchanged behavior)
  let deviceId = localStorage.getItem('device_id');

  if (!deviceId) {
    // Generate a new device ID
    if (
      typeof crypto !== 'undefined' &&
      (crypto as Crypto & { randomUUID?: () => string }).randomUUID
    ) {
      deviceId = (crypto as Crypto & { randomUUID: () => string }).randomUUID();
    } else {
      // Fallback for older browsers
      deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    // Format and store the device ID
    deviceId = formatDeviceId(deviceId);
    localStorage.setItem('device_id', deviceId);
    console.log('[getDeviceId] Generated new device ID for web');
  } else {
    // Format the existing device ID just to be safe
    const formattedId = formatDeviceId(deviceId);
    if (formattedId !== deviceId) {
      localStorage.setItem('device_id', formattedId);
      deviceId = formattedId;
    }
  }

  return deviceId;
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

  // If the formatting removed too much, use a fallback
  if (formatted.length < 8) {
    formatted = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
  }

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
