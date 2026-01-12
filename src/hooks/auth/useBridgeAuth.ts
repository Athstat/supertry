import { useCallback } from "react";
import { authTokenService } from "../../services/auth/authTokenService";
import { logger } from "../../services/logger";

export function useGetBridgeAuthV2() {
  /** Communicates with bridge for the auth token to be
   * saved on the mobile devices async storage
   */
  const saveAccessTokenToMobile = useCallback(async (accessToken: string): Promise<void> => {
    try {
      // If bridge is available, request auth status
      if (window.ScrummyBridge && typeof window.ScrummyBridge.initializeAuth === 'function') {
        window.ScrummyBridge.login(
          { accessToken, refreshToken: accessToken },
          {
            user_id: '',
            email: '',
            name: '',
          }
        );
      }
    } catch (err) {
      console.log('Error saving user auth token to mobile bridge', err);
    }
  }, []);

  /** Returns the auth status object with the saved auth token and user object */
  const getSavedAccessTokenFromMobile = useCallback(async (): Promise<string | undefined> => {
    try {
      // Clean up any existing Keycloak tokens first
      authTokenService.cleanupKeycloakTokens();

      // If bridge is available, request auth status
      if (window.ScrummyBridge && typeof window.ScrummyBridge.initializeAuth === 'function') {
        const authStatus = await window.ScrummyBridge.initializeAuth();


        if (authStatus && authStatus.isAuthenticated) {

          const { tokens } = authStatus;
          return tokens?.accessToken;
        }
      }
    } catch (err) {
      logger.error("Error getting saved access token ", err);
    }

    return undefined;
  }, []);

  return {
    getSavedAccessTokenFromMobile,
    saveAccessTokenToMobile,
  };
}