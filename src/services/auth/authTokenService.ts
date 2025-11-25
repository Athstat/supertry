import { DjangoAuthUser } from '../../types/auth';
import { logger } from '../logger';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const IS_GUEST_ACCOUNT_KEY = 'is_guest_account';
export const AUTH_USER_KEY = 'user';

/**
 * Check if a token is a Keycloak JWT token
 * Keycloak tokens are JWT format with 3 parts separated by dots
 */
function isKeycloakToken(token: string): boolean {
  if (!token) return false;

  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Try to decode the header to check if it's a JWT
    const header = JSON.parse(atob(parts[0]));

    // Keycloak JWTs typically have "typ": "JWT" and "alg" in header
    // Django tokens are simple strings, not JWTs
    return header.typ === 'JWT' && header.alg;
  } catch (error) {
    // If we can't decode it as JWT, it's likely a Django token
    logger.error("Error checking if token is keycloak token ", error);
    return false;
  }
}

/**
 * Clean up old Keycloak tokens if detected
 */
function cleanupKeycloakTokens(): void {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && isKeycloakToken(token)) {
    console.log('Detected old Keycloak token, cleaning up...');
    authTokenService.clearUserTokens();
  }
}

export const authTokenService = {
  saveUserToLocalStorage: (user: DjangoAuthUser) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  getUserFromLocalStorage: () => {
    const jsonStr = localStorage.getItem(AUTH_USER_KEY);

    if (!jsonStr) {
      return undefined;
    }

    try {
      const obj = JSON.parse(jsonStr);
      return obj as DjangoAuthUser;
    } catch (err) {
      logger.error("Error getting user from local storage ", err);
      return undefined;
    }
  },

  /** Clears all user tokens saved in local storage */
  clearUserTokens: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(IS_GUEST_ACCOUNT_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    authTokenService.clearAccessToken();
  },

  setAccessToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getAccessToken: () => {
    // Clean up any old Keycloak tokens first
    cleanupKeycloakTokens();

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token && isKeycloakToken(token)) {
      console.log('Detected Keycloak token during access, clearing...');
      authTokenService.clearUserTokens();
      return null;
    }

    return token;
  },

  clearAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /** Clean up old Keycloak tokens if detected */
  cleanupKeycloakTokens: () => {
    cleanupKeycloakTokens();
  },

  saveGuesAccountTokens: (acessToken: string, user: DjangoAuthUser) => {
    authTokenService.setAccessToken(acessToken);
    authTokenService.saveUserToLocalStorage(user);
    localStorage.setItem(IS_GUEST_ACCOUNT_KEY, 'true');
  },

  saveLoginTokens: (accessToken: string, user: DjangoAuthUser) => {
    authTokenService.setAccessToken(accessToken);
    authTokenService.saveUserToLocalStorage(user);
  },

  getOnesignalId: () => {
    return localStorage.getItem('onesignal_id') ?? undefined;
  },
};
