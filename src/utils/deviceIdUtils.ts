/**
 * Device ID utilities for both mobile app (via WebView) and web browser
 */

/**
 * Get the device ID - either from mobile app or generate/retrieve for web
 * @returns Promise<string> The device ID
 */
export async function getDeviceId(): Promise<string> {
    console.log('[getDeviceId] Starting device ID retrieval...');
    
    // Wait for bridge to be ready if we're in a mobile app
    if (window.ReactNativeWebView && !window.scrummyBridge) {
      console.log('[getDeviceId] Waiting for ScrummyBridge to be ready...');
      await new Promise<void>((resolve) => {
        const checkBridge = () => {
          if (window.scrummyBridge) {
            console.log('[getDeviceId] ScrummyBridge is now ready');
            resolve();
          } else {
            setTimeout(checkBridge, 100);
          }
        };
        checkBridge();
        
        // Also listen for the bridge ready event
        document.addEventListener('ScrummyBridgeReady', () => {
          console.log('[getDeviceId] Received ScrummyBridgeReady event');
          resolve();
        }, { once: true });
      });
    }
    
    console.log('[getDeviceId] window.scrummyBridge:', !!window.scrummyBridge);
    console.log('[getDeviceId] window.scrummyBridge?.getDeviceId:', typeof window.scrummyBridge?.getDeviceId);
    
    // Check if running in mobile app WebView (note: lowercase 'scrummyBridge')
    if (window.scrummyBridge && typeof window.scrummyBridge.getDeviceId === 'function') {
      try {
        console.log('[getDeviceId] Calling scrummyBridge.getDeviceId()...');
        
        // Add timeout to prevent hanging
        const deviceIdPromise = window.scrummyBridge.getDeviceId();
        const timeoutPromise = new Promise<string>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Device ID request timeout after 5 seconds'));
          }, 5000);
        });
        
        const deviceId = await Promise.race([deviceIdPromise, timeoutPromise]);
        console.log('[getDeviceId] Got device ID from mobile app:', deviceId);
        
        // Ensure the device ID is valid for backend
        return formatDeviceId(deviceId);
      } catch (error) {
        console.error('[getDeviceId] Error getting device ID from bridge:', error);
        console.log('[getDeviceId] Falling back to web browser device ID');
      }
    }
  
    // Web browser fallback - use localStorage
    let deviceId = localStorage.getItem('device_id');
    
    if (!deviceId) {
      // Generate a new device ID
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        deviceId = crypto.randomUUID();
      } else {
        // Fallback for older browsers
        deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      }
      
      // Format and store the device ID
      deviceId = formatDeviceId(deviceId);
      localStorage.setItem('device_id', deviceId);
      console.log('[getDeviceId] Generated new device ID for web:', deviceId);
    } else {
      console.log('[getDeviceId] Retrieved existing device ID for web:', deviceId);
      
      // Format the existing device ID just to be safe
      const formattedId = formatDeviceId(deviceId);
      if (formattedId !== deviceId) {
        console.log('[getDeviceId] Reformatting existing device ID:', deviceId, '->', formattedId);
        localStorage.setItem('device_id', formattedId);
        deviceId = formattedId;
      }
    }
    
    return deviceId;
  }
  
  /**
   * Format a device ID to ensure it's acceptable to the backend
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
   * Check if the current environment is a mobile app
   * @returns boolean
   */
  export function isMobileApp(): boolean {
    return typeof window !== 'undefined' && !!window.scrummyBridge;
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