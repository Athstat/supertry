import { useCallback, useEffect } from 'react';
import { AUTH_USER_KEY, authTokenService } from '../services/auth/authTokenService';
import { authService } from '../services/authService';
import { DjangoAuthUser } from '../types/auth';
import { loginWithBridge, requestPushPermissionsAfterLogin } from '../utils/bridgeUtils';

type AuthStatusRes = {
  authToken?: string,
  authUser?: DjangoAuthUser
}

export function useBrudgeAuth(_: boolean, setIsAuthenticated: (val: boolean) => void) {
  const restoreAuthFromMobileApp = useCallback(async () => {
    try {
      // Clean up any existing Keycloak tokens first
      authTokenService.cleanupKeycloakTokens();

      // If bridge is available, request auth status
      if (window.ScrummyBridge && typeof window.ScrummyBridge.initializeAuth === 'function') {
        console.log('AuthContext: Requesting auth status from mobile app via initializeAuth');
        const authStatus = await window.ScrummyBridge.initializeAuth();

        if (authStatus && authStatus.isAuthenticated) {
          console.log('AuthContext: Found authentication status from mobile app:', authStatus);
          const { tokens, userData } = authStatus;

          if (tokens && tokens.accessToken) {
            // Validate token against Django server before accepting it
            authTokenService.setAccessToken(tokens.accessToken);

            try {
              const apiUser = await authService.whoami();

              if (apiUser) {
                authTokenService.saveUserToLocalStorage(apiUser);

                // Store user data if available
                if (userData) {
                  localStorage.setItem('user_data', JSON.stringify(userData));
                }

                console.log(
                  'AuthContext: Successfully restored and validated authentication from mobile app'
                );
                setIsAuthenticated(true);
                return true;
              } else {
                console.log('AuthContext: Token validation failed, clearing mobile app tokens');
                authTokenService.clearUserTokens();
                return false;
              }
            } catch (validationError) {
              console.error('AuthContext: Token validation failed:', validationError);
              authTokenService.clearUserTokens();
              return false;
            }
          }
        }
      }

      // Fallback: Check if we have pre-injected authentication status
      else if (window.scrummyAuthStatus && window.scrummyAuthStatus.isAuthenticated) {
        console.log(
          'AuthContext: Found pre-injected authentication status from mobile app:',
          window.scrummyAuthStatus
        );

        const { tokens, userData } = window.scrummyAuthStatus;

        if (tokens && tokens.accessToken && tokens.refreshToken) {
          // Validate token against Django server before accepting it
          authTokenService.setAccessToken(tokens.accessToken);

          try {
            const apiUser = await authService.whoami();

            if (apiUser) {
              authTokenService.saveUserToLocalStorage(apiUser);

              // Store user data if available
              if (userData) {
                localStorage.setItem('user_data', JSON.stringify(userData));
              }

              console.log(
                'AuthContext: Successfully restored and validated authentication from mobile app (fallback)'
              );
              setIsAuthenticated(true);
              return true;
            } else {
              console.log('AuthContext: Fallback token validation failed, clearing tokens');
              authTokenService.clearUserTokens();
              return false;
            }
          } catch (validationError) {
            console.error('AuthContext: Fallback token validation failed:', validationError);
            authTokenService.clearUserTokens();
            return false;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('AuthContext: Error restoring auth from mobile app:', error);
      // Clear potentially invalid tokens on error
      authTokenService.clearUserTokens();
      return false;
    }
  }, [window]);

  useEffect(() => {
    // Set up the listener for when mobile app provides auth status
    window.onScrummyAuthStatusReady = async status => {
      //console.log('AuthContext: Received auth status from mobile app:', status);

      if (status && status.isAuthenticated) {
        const { tokens, userData } = status;

        if (tokens && tokens.accessToken && tokens.refreshToken) {
          // Store the tokens in the web app's localStorage
          authTokenService.setAccessToken(tokens.accessToken);
          const apiUser = await authService.whoami();

          if (apiUser) {
            authTokenService.saveUserToLocalStorage(apiUser);
          }

          // Store user data if available
          if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
          }

          // console.log(
          //   'AuthContext: Successfully restored authentication from mobile app via callback'
          // );
          setIsAuthenticated(true);
        }
      } else {
        console.log('AuthContext: Mobile app indicates user is not authenticated');
        setIsAuthenticated(false);
      }
    };

    // Cleanup function
    return () => {
      window.onScrummyAuthStatusReady = undefined;
    };
  }, []);

  /** Notifies the bridge of login by reading the auth token,
   * and setting the user data */
  const notifyBridgeOfLogin = async (userInfo: DjangoAuthUser) => {
    try {
      const tokens = {
        accessToken: authTokenService.getAccessToken() || '',
        authUserToken: localStorage.getItem(AUTH_USER_KEY) || '',
        refreshToken: '',
      };

      const userData = {
        name:
          `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() ||
          userInfo.username ||
          '',
        email: userInfo.email || '',
        user_id: userInfo.kc_id || '',
        onesignal_id: authTokenService.getOnesignalId(),
      };

      console.log('AuthContext: Notifying mobile app bridge about login...');

      const bridgeResult = await loginWithBridge(tokens, userData);

      console.log('AuthContext: Mobile app bridge login result:', bridgeResult);
    } catch (bridgeError) {
      console.error('AuthContext: Error notifying mobile app bridge:', bridgeError);
    }

    requestPushPermissionsAfterLogin();

    // Add a delay to ensure the mobile app has processed the login
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  return {
    restoreAuthFromMobileApp,
    notifyBridgeOfLogin,
  };
}


export function useBrudgeAuthV2() {

  /** Communicates with bridge for the auth token to be
   * saved on the mobile devices async storage
   */
  const saveAccessTokenToMobile = async (accessToken: string): Promise<void> => {
    try {

      // If bridge is available, request auth status
      if (window.ScrummyBridge && typeof window.ScrummyBridge.initializeAuth === 'function') {

        window.ScrummyBridge.login({ accessToken, refreshToken: accessToken }, {
          user_id: "",
          email: "",
          name: ""
        });

      }

    } catch (err) {
      console.log("Error saving user auth token to mobile bridge", err);
    }
  }

  /** Returns the auth status object with the saved auth token and user object */
  const getSavedAccessTokenFromMobile = async (): Promise<string | undefined> => {
    try {
      // Clean up any existing Keycloak tokens first
      authTokenService.cleanupKeycloakTokens();

      // If bridge is available, request auth status
      if (window.ScrummyBridge && typeof window.ScrummyBridge.initializeAuth === 'function') {
        console.log('AuthContext: Requesting auth status from mobile app via initializeAuth');
        const authStatus = await window.ScrummyBridge.initializeAuth();

        if (authStatus && authStatus.isAuthenticated) {
          console.log('AuthContext: Found authentication status from mobile app:', authStatus);

          const { tokens } = authStatus;
          return tokens?.accessToken

        }
      }
    }
    catch (err) {

    }

    return undefined;
  }

  return {
    getSavedAccessTokenFromMobile,
    saveAccessTokenToMobile
  };
}
