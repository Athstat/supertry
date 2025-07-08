import { DatabaseUser, ScrummyUser, UserRepresentation } from '../types/auth';
import { getAuthHeader, getUri } from '../utils/backendUtils';
import { analytics } from './anayticsService';
import {
  getDeviceId,
  generateGuestUsername,
  isGuestEmail,
  getDeviceIdFromEmail,
} from '../utils/deviceIdUtils';
import { logger } from './logger';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'athstat-frontend';
const KEYCLOAK_URL =
  import.meta.env.VITE_AUTH_KEYCLOAK_URL || 'https://keycloak-sandbox.athstat-next.com';
const KEYCLOAK_REALM = import.meta.env.VITE_AUTH_KEYCLOAK_REALM || 'athstat-games';

// Helper function to create a timeout promise
function createTimeoutPromise<T>(timeoutMs: number, operation: string): Promise<T> {
  return new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operation} timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

// Helper function to fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

export const authService = {
  /**
   * Create and login a guest user based on device ID
   */
  async createGuestUser(): Promise<any> {
    try {
      console.log('[createGuestUser] Starting guest user creation...');

      console.log('[createGuestUser] Getting device ID...');
      const deviceId = await getDeviceId();
      console.log('[createGuestUser] Device ID obtained:', deviceId);

      const guestEmail = `${deviceId}@devices.scrummy-app.ai`;
      const guestUsername = generateGuestUsername();
      const guestPassword = deviceId;

      console.log('[createGuestUser] Guest details:', {
        email: guestEmail,
        username: guestUsername,
        passwordLength: guestPassword.length,
      });

      // Create guest user data
      const guestUserData: UserRepresentation = {
        email: guestEmail,
        username: guestUsername,
        firstName: 'Guest',
        lastName: 'User',
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: guestPassword,
            temporary: false,
          },
        ],
      };

      try {
        // Try to create the guest user
        console.log('[createGuestUser] Attempting to create games user...');
        await authService.createGamesUser(guestUserData);
        console.log('[createGuestUser] Guest user created successfully');
      } catch (error: any) {
        // If user already exists, that's fine - we'll just login
        if (error.message && error.message.includes('User already exists')) {
          console.log('[createGuestUser] Guest user already exists, proceeding to login');
        } else {
          console.error('[createGuestUser] Error creating user:', error);
          throw error;
        }
      }

      // Now login the guest user
      console.log('[createGuestUser] Attempting to login guest user...');
      const loginResult = await authService.login(guestEmail, guestPassword);
      console.log('[createGuestUser] Login successful');

      // Store a flag indicating this is a guest account
      localStorage.setItem('is_guest_account', 'true');

      return loginResult;
    } catch (error) {
      console.error('[createGuestUser] Error creating/logging in guest user:', error);
      throw error;
    }
  },

  /**
   * Check if the current user is a guest account
   */
  isGuestAccount(): boolean {
    const userInfo = authService.getUserInfo();
    if (!userInfo) return false;

    // Check if email ends with @devices.scrummy-app.ai
    return isGuestEmail(userInfo.email);
  },

  /**
   * Claim a guest account by updating the user's credentials
   */
  async claimGuestAccount(
    newUsername: string,
    newEmail: string,
    newPassword: string
  ): Promise<any> {
    try {
      const userInfo = authService.getUserInfo();
      if (!userInfo || !authService.isGuestAccount()) {
        throw new Error('Not a guest account or not logged in');
      }

      console.log('[claimGuestAccount] Current user info:', userInfo);

      // Use the device ID from the current guest email if possible
      let deviceId = getDeviceIdFromEmail(userInfo.email);
      if (!deviceId) {
        // Fallback to getDeviceId (handles both web and mobile)
        deviceId = await getDeviceId();
      }

      console.log('[claimGuestAccount] Using device ID:', deviceId);

      // Validate inputs to match backend expectations
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(newUsername)) {
        throw new Error(
          'Username must be 3-30 characters and contain only letters, numbers, and underscores'
        );
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        throw new Error('Please enter a valid email address');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const guestEmail = `${deviceId}@devices.scrummy-app.ai`;

      // Update user data
      const updateData = {
        userId: userInfo.id,
        oldEmail: guestEmail,
        newEmail: newEmail,
        newUsername: newUsername,
        newPassword: newPassword,
      };

      console.log('[claimGuestAccount] Request payload:', JSON.stringify(updateData, null, 2));

      const response = await fetchWithTimeout(
        getUri(`/api/v1/private-auth/claim-guest-account/`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(updateData),
        },
        10000
      );

      // Get response body as text first for debugging
      const responseText = await response.text();
      console.log('[claimGuestAccount] Response status:', response.status);
      console.log('[claimGuestAccount] Response body:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to claim account';
        try {
          // Try to parse the response as JSON
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
        } catch (e) {
          // If it's not valid JSON, use the raw text if available
          if (responseText) {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }

      // Parse the response text as JSON
      const result = responseText ? JSON.parse(responseText) : {};

      // Clear guest account flag
      localStorage.removeItem('is_guest_account');

      // Re-login with new credentials
      await authService.logout();
      await authService.login(newEmail, newPassword);

      return result;
    } catch (error) {
      console.error('Error claiming guest account:', error);
      throw error;
    }
  },

  /**
   * Register a new user with Keycloak
   */
  async registerUser(userData: UserRepresentation): Promise<any> {
    try {
      const response = await fetchWithTimeout(
        getUri(`/api/v1/unauth/create-keycloak-user/`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
        10000
      );

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Get the text response for better debugging
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Please check server configuration.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login with Keycloak
   */
  async login(username: string, password: string): Promise<any> {
    try {
      console.log('[login] Starting login process...');
      // Use the token URL directly if available, otherwise construct it
      const tokenUrl =
        import.meta.env.VITE_KEYCLOAK_TOKEN_URL ||
        `${KEYCLOAK_URL}/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

      console.log('[login] Using token URL:', tokenUrl);
      console.log('[login] client_id: ', import.meta.env.VITE_CLIENT_ID);

      const response = await fetchWithTimeout(
        tokenUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: import.meta.env.VITE_GRANT_TYPE || 'password',
            client_id: import.meta.env.VITE_CLIENT_ID || CLIENT_ID,
            username,
            password,
            scope: import.meta.env.VITE_SCOPE || 'openid',
          }),
        },
        10000
      );

      console.log('[login] Response status:', response.status);

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('[login] Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[login] Login failed:', errorData);
        throw new Error(errorData.error_description || 'Login failed');
      }

      const data = await response.json();
      console.log('[login] Login successful, storing tokens');

      // Store tokens in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      analytics.trackUserSignIn('Email');

      return data;
    } catch (error) {
      console.error('[login] Login error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated by verifying token existence and validity
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      // Basic validation - check if token is expired
      // This is a simple check, for production you might want to validate with the server
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds

      if (Date.now() >= expiry) {
        // Token is expired, try to refresh
        this.refreshToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  /**
   * Attempt to refresh the token using the refresh token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const tokenUrl =
        import.meta.env.VITE_KEYCLOAK_TOKEN_URL ||
        `${KEYCLOAK_URL}/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

      const response = await fetchWithTimeout(
        tokenUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            refresh_token: refreshToken,
          }),
        },
        10000
      );

      if (!response.ok) {
        // If refresh fails, clear tokens
        this.logout();
        return false;
      }

      const data = await response.json();

      // Store new tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    analytics.trackUserLogout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_guest_account');
  },

  /**
   * Get user info from the token
   */
  getUserInfo(): {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  } | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));

      return {
        email: payload.email || '',
        id: payload.sub || '',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        username: payload.preferred_username || '',
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },

  async getUserFromDB(id: string): Promise<ScrummyUser | undefined> {

    try {

      const uri = getUri(`/api/v1/users/${id}`);
      const response = await fetchWithTimeout(uri,{
        method: 'GET'
      }, 10000);

      const data = (await response.json()) as ScrummyUser;
      return data;

    } catch (e) {
      logger.error('Error fetching user ', e);
      
    }

    return undefined;

  },

  /**
   * Register a new user with both Keycloak and the games database
   */
  async createGamesUser(userData: UserRepresentation): Promise<any> {
    try {
      console.log('[createGamesUser] Starting createGamesUser...');

      // Check if this is a guest user
      const isGuest = userData.email?.endsWith('@devices.scrummy-app.ai');
      console.log('[createGamesUser] Is guest user:', isGuest);

      // Create the dbuser object similar to the mobile app
      const dbuser = {
        email: userData.email,
        username: userData.username,
        first_name: userData.firstName,
        last_name: userData.lastName,
        us_state: '',
        verification_state: isGuest ? 'guest' : 'pending',
        athcoin_balance: 0,
        geolocation_allowed: false,
        device_id: isGuest ? userData.email?.replace('@devices.scrummy-app.ai', '') : '',
        encrypted_id: userData.email, // Using email as the encrypted_id like in the mobile app
      };

      // Create the payload with user, dbuser, and club (using email as club)
      const payload = {
        user: userData,
        dbuser: dbuser,
        clubName: userData.email,
      };

      console.log('[createGamesUser] Request payload:', JSON.stringify(payload, null, 2));
      const apiUrl = getUri(`/api/v1/unauth/create-games-user/`);
      console.log('[createGamesUser] API URL:', apiUrl);

      const response = await fetchWithTimeout(
        apiUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
        15000
      ); // Increased timeout to 15 seconds for user creation

      console.log('[createGamesUser] Response status:', response.status);
      console.log('[createGamesUser] Response headers:', response.headers);

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Get the text response for better debugging
        const textResponse = await response.text();
        console.error('[createGamesUser] Non-JSON response:', textResponse);

        // Check for specific error messages in the text response
        if (textResponse.includes('User already exists')) {
          throw new Error('User already exists');
        }

        throw new Error('Server returned non-JSON response. Please check server configuration.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[createGamesUser] Error response:', errorData);

        // Check for specific error messages
        if (
          errorData === 'User already exists in Keycloak' ||
          errorData === 'User already exists'
        ) {
          throw new Error('User already exists');
        }

        if (errorData === 'error' || errorData === 'Unable to create user') {
          throw new Error('An error occurred, please try again later');
        }

        throw new Error(errorData || 'Registration failed');
      }

      const result = await response.json();
      console.log('[createGamesUser] Success response:', result);
      return result;
    } catch (error: any) {
      console.error('[createGamesUser] Registration error:', error);
      // If it's a timeout error, provide a more user-friendly message
      if (error.message && error.message.includes('timeout')) {
        throw new Error('The server is taking too long to respond. Please try again.');
      }
      throw error;
    }
  },

  getUserById: async (userId: string): Promise<DatabaseUser | undefined> => {
    try {
      const uri = getUri(`/api/v1/users/${userId}`);
      const res = await fetch(uri, {
        headers: getAuthHeader(),
      });

      const json = await res.json();
      console.log('User from get user by id ', json);

      return json;
    } catch (error) {
      logger.error('Error fetching user by id ' + error);
      return undefined;
    }
  },

  /**
   * Request a password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetchWithTimeout(
        getUri(`/api/v1/unauth/forgot-password/`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
        10000
      );

      const data = await response.text();

      if (data === 'User not found') {
        throw new Error('No account found with that email address');
      }
      if (data === 'Reset Password Failed') {
        throw new Error('Failed to send password reset email');
      }

      if (!response.ok) {
        throw new Error('Failed to send password reset email');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  /**
   * Reset password using the reset token
   */
  async resetPassword(email: string, resetToken: string, newPassword: string): Promise<void> {
    console.log('email', email);
    console.log('resetToken', resetToken);
    console.log('newPassword', newPassword);
    try {
      const response = await fetchWithTimeout(
        getUri(`/api/v1/public-auth/reset-password/`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            reset_token: resetToken,
            newPassword: newPassword,
          }),
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response.text();
        if (errorData === 'Invalid token') {
          throw new Error('Invalid or expired reset token');
        }
        if (errorData === 'Password reset failed') {
          throw new Error('Failed to reset password');
        }
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
};
