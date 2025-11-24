import {
  ClaimGuestAccountReq,
  ClaimGuestAccountResult,
  DjangoAuthUser,
  DjangoDeviceAuthRes,
  DjangoLoginRes,
  RegisterUserReq,
  RestError,
  RestPromise,
  ThrowableRes,
  UserPasswordStatus,
  UserPasswordStatusRes,
  DjangoRegisterRes,
  RequestPasswordResetRes,
  ResetPasswordRes,
  PasswordResetTokenIntrospect,
  RequestEmailVerificationRes,
  VerifyEmailRes,
} from '../types/auth';

import { applicationJsonHeader, getAuthHeader, getUri } from '../utils/backendUtils';
import { isGuestEmail } from '../utils/deviceId/deviceIdUtils';
import { emailValidator } from '../utils/stringUtils';
import { analytics } from './analytics/anayticsService';
import { logger } from './logger';
import { authTokenService, IS_GUEST_ACCOUNT_KEY } from './auth/authTokenService';
import { mutate } from 'swr';
import { swrFetchKeys } from '../utils/swrKeys';
import { DeviceIdPair } from '../types/device';

type DeviceIdData = {
  realDeviceId: string;
  storedDeviceId: string;
};

export const authService = {
  /** Authenticates a guest user using their device's id */
  async authenticateAsGuestUser(deviceId: DeviceIdData): RestPromise<DjangoDeviceAuthRes> {
    try {
      const uri = getUri('/api/v1/auth/device');

      const res = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({ device_id: deviceId }),
      });

      console.log('Device auth response: ', res);

      if (res.ok) {
        const json = (await res.json()) as DjangoDeviceAuthRes;

        console.log('Device auth json response: ', json);

        authTokenService.saveGuesAccountTokens(json.token, json.user);
        return { data: json };
      }

      if (res.status === 400) {
        const errJson = (await res.json()) as RestError;
        return { error: errJson };
      }
    } catch (error: any) {
      logger.error('Error on device auth ', error);
    }

    return { error: { message: 'Something went wrong, Please try again ' } };
  },

  /** Check if the current user is a guest account */
  isGuestAccount: async (): Promise<boolean> => {
    const userInfo = await authService.getUserInfo();
    if (userInfo === null) return false;

    return isGuestEmail(userInfo.email);
  },

  /** Claim a guest account by updating the user's credentials */
  async claimGuestAccount(data: ClaimGuestAccountReq): RestPromise<ClaimGuestAccountResult> {
    try {
      console.log('Starting to claim guest account ');
      const userInfo = await authService.whoami();
      const isGuest = await authService.isGuestAccount();

      if (!userInfo || !isGuest) {
        return { error: { message: 'Not a guest account or not logged in' } };
      }

      // was causing claim account to hang
      // if (data.username) {
      //   console.log('Who am i', userInfo);
      //   const isUsernameValid = validateUsername(data.username);
      //   console.log('isUsernameValid', isUsernameValid);

      //   if (!isUsernameValid)
      //     return {
      //       error: {
      //         error: 'Invalid Username',
      //         message: `Username ${data.username} is invalid`,
      //       },
      //     };
      // }

      const isEmailValid = emailValidator(data.email);

      if (!isEmailValid)
        return {
          error: {
            error: 'Invalid Email',
            message: 'Email is invalid',
          },
        };

      console.log('[claimGuestAccount] Request payload:', JSON.stringify(data));

      const uri = getUri(`/api/v1/auth/device/link`);

      const response = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const json = (await response.json()) as ClaimGuestAccountResult;

        localStorage.removeItem(IS_GUEST_ACCOUNT_KEY);
        authTokenService.saveUserToLocalStorage(json.user);

        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json };
      }
    } catch (error) {
      console.error('Error claiming guest account:', error);
    }

    return {
      error: {
        error: 'Unkown Error',
        message: 'Something went wrong trying to claim your account. Please try Again',
      },
    };
  },

  /**
   * Register a new user with Keycloak
   */
  async registerUser(userData: RegisterUserReq): RestPromise<DjangoRegisterRes> {
    try {
      const uri = getUri('/api/v1/auth/register');
      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const json = (await response.json()) as DjangoRegisterRes;
        analytics.trackUserSignUp('Email');
        authTokenService.saveLoginTokens(json.token, json.user);
        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json };
      }
    } catch (error) {
      console.error('Registration error:', error);
    }

    return {
      error: {
        error: 'Unkown Error',
        message: 'Something went wrong, please try again',
      },
    };
  },

  /**
   * Login with Keycloak
   */
  async login(email: string, password: string): Promise<ThrowableRes<DjangoLoginRes>> {
    try {
      const uri = getUri(`/api/v1/auth/login`);

      const res = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log('Login Result ', res);

      if (res.ok) {
        const json = (await res.json()) as DjangoLoginRes;

        authTokenService.saveLoginTokens(json.token, json.user);
        analytics.trackUserSignIn('Email');
        return { data: json, message: 'Login Successful' };
      }

      if (res.status === 404) {
        return { message: 'Incorrect password' };
      }

      if (res.status === 401) {
        return { message: 'Incorrect password' };
      }

      
    } catch (error) {
      logger.error('Error loging in user with email ', email, ' error: ', error);
      console.log('Login Error ', error);
    }

    return { message: 'Something went wrong, please try again' };
  },

  /** Check if user is authenticated by verifying token existence and validity */
  async isAuthenticated(): Promise<boolean> {
    const token = authTokenService.getAccessToken();
    if (!token) return false;

    try {
      // Validate token against Django server
      const user = await authService.whoami();
      if (user) {
        // Update local storage with fresh user data
        authTokenService.saveUserToLocalStorage(user);
        return true;
      }

      // If whoami fails, clear invalid tokens
      authTokenService.clearUserTokens();
      return false;
    } catch (error) {
      console.error('Authentication validation failed:', error);
      // Clear potentially invalid tokens
      authTokenService.clearUserTokens();
      return false;
    }
  },

  /** Synchronous check for token existence only (use sparingly) */
  hasToken(): boolean {
    const token = authTokenService.getAccessToken();
    return !!token;
  },

  logout(): void {
    analytics.trackUserLogout();
    authTokenService.clearUserTokens();
  },

  /**
   * Get user info from the token
   */
  getUserInfo: async (): Promise<DjangoAuthUser | null> => {
    const auth_user_local_storage = authTokenService.getUserFromLocalStorage();

    if (!auth_user_local_storage) {
      const user = await authService.whoami();
      if (user) authTokenService.saveUserToLocalStorage(user);
      return user ?? null;
    }

    return auth_user_local_storage;
  },

  getUserInfoSync: (): DjangoAuthUser | null => {
    const auth_user_local_storage = authTokenService.getUserFromLocalStorage();
    return auth_user_local_storage || null;
  },

  /** Refetches user and updates local storage cache */
  updateUserInfo: async (): Promise<DjangoAuthUser | undefined> => {
    try {
      const user = await authService.whoami();

      console.log('User Info: ', user);

      if (user) {
        authTokenService.saveUserToLocalStorage(user);
        await mutate(swrFetchKeys.getAuthUserProfileKey());
      }

      return user;
    } catch (error) {
      console.log('Error updating user info ', error);
    }

    return undefined;
  },

  /** Updates user realDeviceId and storedDeviceId on the backend and refreshes local cache */
  updateUserDeviceId: async (deviceId: DeviceIdPair) => {
    try {
      const token = authTokenService.getAccessToken();
      if (!token) {
        return undefined;
      }

      const uri = getUri('/api/v1/auth/me/device');
      const res = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          realDeviceId: deviceId.realDeviceId,
          storedDeviceId: deviceId.storedDeviceId,
        }),
      });

      if (res.ok) {
        const updatedUser = (await res.json()) as DjangoAuthUser;
        console.log('Updated user (device sync): ', updatedUser);
        authTokenService.saveUserToLocalStorage(updatedUser);
        await mutate(swrFetchKeys.getAuthUserProfileKey());
        return updatedUser;
      }

      // Log server error body if available
      try {
        const errJson = await res.json();
        logger.error('Failed to update device ids', errJson);
      } catch {
        logger.error('Failed to update device ids', res.status);
      }
    } catch (error) {
      console.log('Error updating user device ids ', error);
    }

    return undefined;
  },

  async getUserById(id: string): Promise<DjangoAuthUser | undefined> {
    try {
      const uri = getUri(`/api/v1/users/${id}`);
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      const data = (await response.json()) as DjangoAuthUser;
      return data;
    } catch (e) {
      logger.error('Error fetching user ', e);
    }

    return undefined;
  },

  /**
   * Request a password reset email
   */
  async requestPasswordReset(
    email: string,
    forced: boolean = false
  ): Promise<RequestPasswordResetRes | undefined> {
    try {
      const uri = getUri(`/api/v1/auth/request-password-reset`);

      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({ email, forced }),
      });

      if (response.ok) {
        return {
          message:
            'If an account exists with this email, you will receive password reset instructions shortly.',
        };
      }
    } catch (error) {
      console.error('Password reset error:', error);
    }

    return undefined;
  },

  /** Reset password using the reset token */
  async resetPassword(resetToken: string, newPassword: string): RestPromise<ResetPasswordRes> {
    try {
      const uri = getUri(`/api/v1/auth/reset-password/${resetToken}`);

      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        const json = (await response.json()) as ResetPasswordRes;
        authTokenService.clearUserTokens();
        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json };
      }
    } catch (error) {
      console.error('Password reset error:', error);
    }

    return {
      error: {
        error: 'Unkown Error',
        message: 'Something went wrong whiles trying to reset your password. Please try again',
      },
    };
  },

  getPasswordStatus: async (email: string): Promise<UserPasswordStatusRes> => {
    try {
      const uri = getUri(`/api/v1/users/password-status/${email}`);
      const res = await fetch(uri, {});

      if (res.ok) {
        const status = (await res.json()) as UserPasswordStatus;
        return { status, message: 'Password Status Recieved' };
      }

      if (res.status === 404) {
        return { message: 'Email was not found' };
      }
    } catch (err) {
      logger.error('Error Fetching user password status ', err);
    }

    return { message: 'Something went wrong' };
  },

  whoami: async (accessToken?: string) => {
    try {
      const uri = getUri('/api/v1/auth/me');

      const res = await fetch(uri, {
        headers: getAuthHeader(accessToken),
      });

      if (res.ok) {
        const json = (await res.json()) as DjangoAuthUser;
        return json;
      }
    } catch (error) {
      logger.error('Who am i failed to fetch ', error);
    }

    return undefined;
  },

  introspectPasswdResetToken: async (token: string): RestPromise<PasswordResetTokenIntrospect> => {
    try {
      const uri = getUri(`/api/v1/auth/reset-password/introspect/${token}`);
      const res = await fetch(uri);

      if (res.ok) {
        const json = (await res.json()) as PasswordResetTokenIntrospect;
        return { data: json };
      }

      if (res.status === 404) {
        const message = 'Password reset link has either expired or is invalid';
        return { error: { message } };
      }
    } catch (err) {
      logger.error('Error introspecting token ', err);
    }

    return {
      error: {
        error: 'Error',
        message: 'Something went wrong',
      },
    };
  },

  /** Authenticate with Google OAuth using authorization code (web flow) */
  async googleOAuth(token: string): RestPromise<DjangoLoginRes> {
    try {
      const uri = getUri('/api/v1/auth/oauth/google/');

      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({ token, token_type: 'code' }),
      });

      if (response.ok) {
        const json = (await response.json()) as DjangoLoginRes;
        authTokenService.saveLoginTokens(json.token, json.user);
        analytics.trackUserSignIn('Google');
        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json };
      }
    } catch (error) {
      logger.error('Google OAuth error:', error);
    }

    return {
      error: {
        error: 'OAuth Error',
        message: 'Something went wrong with Google sign in. Please try again.',
      },
    };
  },

  /** Authenticate with Google OAuth using ID token (mobile flow) */
  async googleOAuthWithIdToken(idToken: string): RestPromise<DjangoLoginRes> {
    try {
      const uri = getUri('/api/v1/auth/oauth/google/');

      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({ token: idToken, token_type: 'id_token' }),
      });

      if (response.ok) {
        const json = (await response.json()) as DjangoLoginRes;
        authTokenService.saveLoginTokens(json.token, json.user);
        analytics.trackUserSignIn('Google');
        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json };
      }
    } catch (error) {
      logger.error('Google OAuth with ID token error:', error);
    }

    return {
      error: {
        error: 'OAuth Error',
        message: 'Something went wrong with Google sign in. Please try again.',
      },
    };
  },

  /** Authenticate with Apple OAuth */
  async appleOAuth(token: string): RestPromise<DjangoLoginRes> {
    try {
      const uri = getUri('/api/v1/auth/oauth/apple/');

      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const json = (await response.json()) as DjangoLoginRes;
        authTokenService.saveLoginTokens(json.token, json.user);
        analytics.trackUserSignIn('Apple');
        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json };
      }
    } catch (error) {
      logger.error('Apple OAuth error:', error);
    }

    return {
      error: {
        error: 'OAuth Error',
        message: 'Something went wrong with Apple sign in. Please try again.',
      },
    };
  },

  requestEmailVerification: async (): RestPromise<RequestEmailVerificationRes> => {
    try {
      const uri = getUri(`/api/v1/auth/resend-verification`);

      const res = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const json = (await res.json()) as RequestEmailVerificationRes;
        return { data: json };
      }
    } catch (err) {
      console.log('Error requesting email verification ', err);
    }

    return {
      error: {
        message:
          "Something wen't wrong request for an email verification. Please try again shortly",
      },
    };
  },

  verifyEmailWithToken: async (token: string): RestPromise<VerifyEmailRes> => {
    try {
      const uri = getUri(`/api/v1/auth/verify-email/${token}`);

      const res = await fetch(uri, {
        method: 'POST',
        headers: getAuthHeader(),
      });

      if (res.ok) {
        const json = (await res.json()) as VerifyEmailRes;
        return { data: json };
      }

      if (res.status === 404) {
        return { error: { message: 'Email verification is either invalid or has expired' } };
      }
    } catch (err) {
      console.log('Error verifying email ', err);
    }

    return {
      error: {
        message: "Something wen't wrong trying to verify your email. Please try again",
      },
    };
  },
};
