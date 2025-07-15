import { 
  ClaimGuestAccountReq, ClaimGuestAccountResult, DjangoAuthUser,
  DjangoDeviceAuthRes, DjangoLoginRes, AuthRegisterReq, RestError,
  RestPromise, ThrowableRes, UserPasswordStatus, UserPasswordStatusRes,
  DjangoRegisterRes, RequestPasswordResetRes, ResetPasswordRes 
} from '../types/auth';

import { applicationJsonHeader, getAuthHeader, getUri } from '../utils/backendUtils';
import { validatePassword, validateUsername } from '../utils/authUtils';
import { getDeviceId, isGuestEmail } from '../utils/deviceIdUtils';
import { emailValidator } from '../utils/stringUtils';
import { analytics } from './anayticsService';
import { logger } from './logger';
import { authTokenService, IS_GUEST_ACCOUNT_KEY } from './auth/authTokenService';

export const authService = {

  /** Authenticates a guest user using their device's id */
  async authenticateGuestUser(): RestPromise<DjangoDeviceAuthRes> {

    try {
      const deviceId = await getDeviceId();
      const uri = getUri('/api/v1/auth/device');

      const res = await fetch(uri, {
        method: "POST",
        headers: applicationJsonHeader(),
        body: JSON.stringify({ 'device_id': deviceId })
      });

      if (res.ok) {
        const json = (await res.json()) as DjangoDeviceAuthRes

        authTokenService.saveGuesAccountTokens(json.token, json.user);
        return { data: json }
      }

      if (res.status === 400) {
        const errJson = (await res.json()) as RestError;
        return { error: errJson };
      }

    } catch (error: any) {
      logger.error("Error on device auth ", error);
    }

    return { error: { message: "Something went wrong, Please try again " } };
  },

  /** Check if the current user is a guest account */
  isGuestAccount: async (): Promise<boolean> => {
    const userInfo = await authService.getUserInfo();
    if (userInfo === null) return false;

    return isGuestEmail(userInfo.email);
  },

  /** * Claim a guest account by updating the user's credentials */
  async claimGuestAccount(data: ClaimGuestAccountReq): RestPromise<any> {
    try {

      const userInfo = await authService.getUserInfo();

      if (!userInfo || !authService.isGuestAccount()) {
        return { error: { message: 'Not a guest account or not logged in' } };
      }

      if (data.username) {
        const isUsernameValid = validateUsername(data.username);

        if (!isUsernameValid) return {
          error: {
            error: 'Invalid Username',
            message: `Username ${data.username} is invalid`
          }
        }
      }

      const isEmailValid = emailValidator(data.email);

      if (isEmailValid) return {
        error: {
          error: 'Invalid Email',
          message: "Email is invalid"
        }
      }

      const [isPasswordValid, reason] = validatePassword(data.password);

      if (!isPasswordValid) return {
        error: {
          error: 'Invalid Password',
          message: reason ?? "Password is invalid"
        }
      }

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

        return { data: json }
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json }
      }

    } catch (error) {
      console.error('Error claiming guest account:', error);
    }

    return {
      error: {
        error: "Unkown Error",
        message: "Something went wrong trying to claim your account. Please try Again"
      }
    }
  },

  /**
   * Register a new user with Keycloak
   */
  async registerUser(userData: AuthRegisterReq): RestPromise<DjangoRegisterRes> {
    try {

      const uri = getUri('/api/v1/auth/register');
      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify(userData),
      }
      );

      if (response.ok) {
        const json = (await response.json()) as DjangoRegisterRes;

        authTokenService.saveLoginTokens(json.token, json.user);
        return { data: json };
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json }
      }

    } catch (error) {
      console.error('Registration error:', error);
    }

    return {
      error: {
        error: 'Unkown Error',
        message: 'Something went wrong, please try again'
      }
    }
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
          'email': email,
          'password': password
        })
      });

      if (res.ok) {

        const json = (await res.json()) as DjangoLoginRes;

        authTokenService.saveLoginTokens(json.token, json.user);
        return { data: json, message: 'Login Successful' }

      }

      if (res.status === 404) {
        return { message: 'Incorrect password' }
      }

      analytics.trackUserSignIn('Email');

    } catch (error) {
      logger.error("Error loging in user with email ", email, ' error: ', error)
    }

    return { message: 'Something went wrong, please try again' }
  },

  /** Check if user is authenticated by verifying token existence and validity */
  isAuthenticated(): boolean {
    const token = authTokenService.getAccessToken();
    if (!token) return false;

    return authService.getUserInfo() !== null;
  },

  logout(): void {
    analytics.trackUserLogout();
    authTokenService.clearUserTokens();
  },

  /**
   * Get user info from the token
   */
  getUserInfo: async (): Promise<DjangoAuthUser | null> => {

    const auth_user_local_storage = localStorage.getItem('auth_user');

    if (!auth_user_local_storage) {
      const user = await authService.whoami();
      return user ?? null;
    }

    try {
      const tokenUser = JSON.parse(auth_user_local_storage) as DjangoAuthUser;
      return tokenUser;
    } catch (err) {
      logger.error("Error getting user info from local storage ", err)
    }

    return null
  },

  async getUserById(id: string): Promise<DjangoAuthUser | undefined> {

    try {

      const uri = getUri(`/api/v1/users/${id}`);
      const response = await fetch(uri, {
        method: 'GET',
        headers: getAuthHeader()
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
  async requestPasswordReset(email: string, forced: boolean = false): Promise<RequestPasswordResetRes | undefined> {
    try {
      const uri = getUri(`/api/v1/auth/request-password-reset`);

      const response = await fetch(uri, {
        method: 'POST',
        headers: applicationJsonHeader(),
        body: JSON.stringify({ email, forced }),
      },
      );

      if (response.ok) {
        return { message: 'If an account exists with this email, you will receive password reset instructions shortly.' }
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
          new_password: newPassword
        }),
      });

      if (response.ok) {
        const json = (await response.json()) as ResetPasswordRes;
        return { data: json }
      }

      if (response.status === 400) {
        const json = (await response.json()) as RestError;
        return { error: json }
      }

    } catch (error) {
      console.error('Password reset error:', error);
    }

    return {
      error: {
        error: 'Unkown Error',
        message: 'Something went wrong whiles trying to reset your password. Please try again'
      }
    }
  },

  getPasswordStatus: async (email: string): Promise<UserPasswordStatusRes> => {
    try {

      const uri = getUri(`/api/v1/users/password-status/${email}`);
      const res = await fetch(uri, {});

      if (res.ok) {
        const status = await res.json() as UserPasswordStatus
        return { status, message: 'Password Status Recieved' }
      }

      if (res.status === 404) {
        return { message: 'Email was not found' }
      }

    } catch (err) {
      logger.error("Error Fetching user password status ", err);
    }

    return { message: "Something went wrong" }
  },

  whoami: async () => {
    try {
      const uri = getUri('/api/v1/users/me');

      const res = await fetch(uri, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        const json = (await res.json()) as DjangoAuthUser;
        return json
      }

    } catch (error) {
      logger.error('Who am i failed to fetch ', error);
    }

    return undefined;
  }

};
